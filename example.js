/* utils */
function getHTMLString(view) {
    const state = view.state || view
    const fragment = PM.model.DOMSerializer.fromSchema(
        state.schema
    ).serializeFragment(state.doc.content)
    const div = document.createElement('div')
    div.appendChild(fragment)
    return div.innerHTML
}


function autoFocus(view, delay = 250) {
    setTimeout(() => view.focus(), delay)
}


/* cmds  */
// ------------------------------------------ 
function evalState(state, dispatch) { /* cmd */
    let s = ''
    runner(state.doc.toJSON())
    return s

    function runner(a) {
        if (isArray(a)) {
            for (let item of a) {
                runner(a)
            }
        }
        else if (isObject(a)) {
            console.log(JSON.stringify(a))
            const {content, type, text} = a
            if (content) {
                runner(content)
            }
            else {
                if (text) {
                    s += text
                }
                if (type == 'paragraph') {
                    s += '\n'
                }
            }
        }
    }
}



const customKeymap = {
    //'Mod-j': evalState,
    'Mod-g': boo,
    'Mod-s': saveAsHtml,
}

function boo() {
    console.log('hi from boo')
    return true
}

function saveAsHtml(state) {
    const html = getHTMLString(state)
    download('pm.text.js', html)
    return true
}


// ------------------------------------------ 
const elementFromString = (value) => {
  const element = document.createElement("span");
  element.innerHTML = value.trim();

  return element;
};

const insertHTML = ({ state, view }, value) => {
  const { selection } = state;
  const element = elementFromString(value);
  const slice = DOMParser.fromSchema(state.schema).parseSlice(element);
  const transaction = state.tr.insert(selection.anchor, slice.content);

  view.dispatch(transaction);
};



function simpleSetup(schema, mapKeys) {
    const plugins = [
        history(),
        dropCursor(),
        gapCursor(),
        buildInputRules(schema),
        keymap(customKeymap),
        keymap(buildKeymap(schema, mapKeys)),
        keymap(baseKeymap),
    ]
    return plugins

    return plugins.concat(
        new Plugin({
            props: {
                attributes: {
                    class: 'ProseMirror-example-setup-style',
                },
            },
        })
    )
}



const { keymap } = PM.keymap
const { history } = PM.history
const { Plugin } = PM.state
const { dropCursor } = PM.dropcursor
const { gapCursor } = PM.gapcursor

const { EditorState } = PM.state

const {
    wrapIn,
    setBlockType,
    chainCommands,
    toggleMark,
    exitCode,
    joinUp,
    joinDown,
    lift,
    selectParentNode,
    baseKeymap,
} = PM.commands
const { 
    wrapInList, splitListItem, liftListItem, sinkListItem
} = PM.schema_list
const { undo, redo } = PM.history

const {
    inputRules,
    undoInputRule,
    wrappingInputRule,
    textblockTypeInputRule,
    smartQuotes,
    emDash,
    ellipsis,
    InputRule
} = PM.inputrules

//const aa = new InputRule(/\wx$/, 

function imapInputRuleMaker(dict) {

    function fn(state, match, start, end) {
        let insert = dict[match[0]]
        if (insert) {
            return state.tr.insertText(insert, start, end)
        }
    }
    const regex = RegExp('(?:' + Object.keys(dict).join('|') + ')$')
    return new InputRule(regex, fn)
}

imapdict = {
    'abc': 'ABC'
}
function buildInputRules(schema) {
    let rules = smartQuotes.concat(ellipsis, emDash)
    merge(rules, imapInputRuleMaker(imapdict))
    let type

    if ((type = schema.nodes.blockquote))
        rules.push(blockQuoteRule(type))
    if ((type = schema.nodes.ordered_list))
        rules.push(orderedListRule(type))
    if ((type = schema.nodes.bullet_list))
        rules.push(bulletListRule(type))
    if ((type = schema.nodes.code_block))
        rules.push(codeBlockRule(type))
    if ((type = schema.nodes.heading))
        console.log('hooooooooooooooooo')
        rules.push(headingRule(type, 6))
    return inputRules({ rules })
}



function blockQuoteRule(nodeType) {
    return wrappingInputRule(/^\s*>\s$/, nodeType)
}

function orderedListRule(nodeType) {
    return wrappingInputRule(
        /^(\d+)\.\s$/,
        nodeType,
        (match) => ({ order: +match[1] }),
        (match, node) =>
            node.childCount + node.attrs.order == +match[1]
    )
}

function bulletListRule(nodeType) {
    return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

function codeBlockRule(nodeType) {
    return textblockTypeInputRule(/^```$/, nodeType)
}

function headingRule(nodeType, maxLevel = 6) {
    return textblockTypeInputRule(
        new RegExp('^(#{1,' + maxLevel + '})\\s$'),
        nodeType,
        (match) => ({ level: match[1].length })
    )
}







function buildKeymap(schema, mapKeys) {
    let keys = {},
        type
    function bind(key, cmd) {
        if (mapKeys) {
            let mapped = mapKeys[key]
            if (mapped === false) return
            if (mapped) key = mapped
        }
        keys[key] = cmd
    }

    bind('Mod-z', undo)
    bind('Shift-Mod-z', redo)
    bind('Backspace', undoInputRule)

    bind('Alt-ArrowUp', joinUp)
    bind('Alt-ArrowDown', joinDown)
    bind('Mod-BracketLeft', lift)
    bind('Escape', selectParentNode)

    if ((type = schema.marks.strong)) {
        bind('Mod-b', toggleMark(type))
        bind('Mod-B', toggleMark(type))
    }
    if ((type = schema.marks.em)) {
        bind('Mod-i', toggleMark(type))
        bind('Mod-I', toggleMark(type))
    }
    if ((type = schema.marks.code)) bind('Mod-`', toggleMark(type))

    if ((type = schema.nodes.bullet_list))
        console.log('hoooo bullet list')
        bind('Shift-Ctrl-8', wrapInList(type))
    if ((type = schema.nodes.ordered_list))
        bind('Shift-Ctrl-9', wrapInList(type))
    if ((type = schema.nodes.blockquote)) bind('Ctrl->', wrapIn(type))
    if ((type = schema.nodes.hard_break)) {
        let br = type,
            cmd = chainCommands(exitCode, (state, dispatch) => {
                dispatch(
                    state.tr
                        .replaceSelectionWith(br.create())
                        .scrollIntoView()
                )
                return true
            })
        bind('Mod-Enter', cmd)
        bind('Shift-Enter', cmd)
    }
    if ((type = schema.nodes.list_item)) {
        bind('Enter', splitListItem(type))
        bind('Mod-[', liftListItem(type))
        bind('Mod-]', sinkListItem(type))
    }
    if ((type = schema.nodes.paragraph))
        bind('Shift-Ctrl-0', setBlockType(type))
    if ((type = schema.nodes.code_block))
        bind('Shift-Ctrl-\\', setBlockType(type))
    if ((type = schema.nodes.heading))
        for (let i = 1; i <= 6; i++)
            bind('Shift-Ctrl-' + i, setBlockType(type, { level: i }))
    if ((type = schema.nodes.horizontal_rule)) {
        console.log('hooooooooo horo')
        let hr = type
        bind('Mod-u', (state, dispatch) => {
            console.log(state)
            z = state
            //returnMark: 04-02-2022 
            //view.dispatch(z.tr.setSelection(
            // this is a way to visualize what is happening
            dispatch(
                state.tr
                    .replaceSelectionWith(hr.create())
                    .scrollIntoView()
                    //.setSelection()
            )
            return true
        })
    }

    return keys
}

const {DOMParser} = PM.model

function createState({doc, schema, plugins}) {
    //const config = doc ?
        //{ doc: DOMParser.fromSchema(schema).parse(stringToInvisibleNode(doc)), schema, plugins } :
        //{ schema, plugins }

        const config = { doc: DOMParser.fromSchema(schema).parse(doc || ''), schema, plugins }
    return EditorState.create(config)
}

function stringToInvisibleNode(s) {
    return createElement('div', {
        style: {
            display: 'none'
        },
        innerHTML: divify('p', '', s),
    })
}


















;(function (
    EditorState,
    EditorView,
    prosemirrorModel,
    prosemirrorSchemaBasic,
    prosemirrorSchemaList
) {
    console.log(prosemirrorSchemaBasic.schema.spec.nodes)
    schema = new prosemirrorModel.Schema({
        nodes: prosemirrorSchemaList.addListNodes(
            prosemirrorSchemaBasic.schema.spec.nodes,
            'paragraph block*',
            'block',
            'heading',
            'horizontal_rule',
        ),
        marks: prosemirrorSchemaBasic.schema.spec.marks,
    })

    plugins = simpleSetup(schema)
    doc = 'hi there'
    state = createState({ schema, plugins, doc })
    selector = document.querySelector('.app-editor')
    view = new EditorView(selector, {state})
    autoFocus(view)
})(
    PM.state.EditorState,
    PM.view.EditorView,
    PM.model,
    PM.schema_basic,
    PM.schema_list
)
