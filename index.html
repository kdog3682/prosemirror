function downloadLocalStorage(key) {
    const value = key ? getStorage(key) : runner()
    download('local-storage.json', value)
    function runner() {
        return JSON.stringify(localStorage)
    }
}
function download(file, content) {
    if (!exists(content)) return

    if (isJson(file)) {
        content = stringify(content)
    } else {
        switch (type(content)) {
            case 'Object':
            case 'Storage':
                content = joined(Object.values(content))
                break
            case 'Array':
                content = joined(content)
                break
        }
    }

    const element = createElement('a', {
        href: 'data:text/plain;charset=utf-8,' + encodeURIComponent(content),
        download: file,
    })

    element.click()
    element.remove()
}

function setStorage(key, value = '') {
    if (!exists(value)) return
    localStorage.setItem(key, stringify(value))
}

function getStorage(key, fallback = {}) {
    let item = localStorage.getItem(key)
    return item ? parseJSON(item) : getFallback(fallback)

    function getFallback(x) {
        if (x == null) {
            return ''
        }

        if (x == Array) {
            return []
        }

        if (x == Object) {
            return {}
        }

        if (x == String) {
            return ''
        }

        if (x == Number) {
            return 0
        }
        return x
    }
}

function getBoundingClientRect(element) {
    const { height, width, top, left } = element.getBoundingClientRect()
    return {
        height: height + 'px',
        width: width + 'px',
        left: left + 'px',
        top: top + 'px',
    }
}

function isTypable(e) {
    if (e.altKey || e.ctrlKey) return
    let s = e.key || e
    return s.length == 1 || s == ''
}

function clearStorage(key) {
    key ? delete localStorage[key] : localStorage.clear()
}

function getClipboard(s) {
    return navigator.clipboard.readText()
}

function setClipboard(s) {
    return navigator.clipboard.writeText(stringify(s))
}

function scrollToTop(element) {
    element.scrollTop = 0
}

function scrollToBottom(element) {
    setTimeout(() => (element.scrollTop = element.scrollHeight), 100)
}

function getStylesheets() {
    function runner(sheet) {
        try {
            if (sheet.rules.length > 100) return 
            return Array.from(sheet.cssRules).map((x) => x.cssText)
        }

        catch(e) {
        return null
        }
    }
    return Array.from(document.styleSheets).map(runner).filter(exists)
}

function removeStylesheets() {
    Array.from(document.styleSheets).forEach((sheet) => {
        sheet.disabled = true
        sheet.parentNode.removeChild(sheet)
    })
}

function speak(input, rate = 1) {
    if (!exists(input)) {
        console.log('noinout')
        return
    }
    console.log(input)
    if (rate < 0.1 || rate > 1 || !isNumber(rate)) rate = 1
    isArray(input) ? (input = input.join(' ')) : input
    const utter = new SpeechSynthesisUtterance()
    utter.rate = rate
    utter.pitch = 0.9
    utter.text = input.trimStart() || 'empty'
    utter.onsuccess = function () {
        console.log('@onsuccess successful speak')
    }
    utter.onerror = function (e) {
        console.log(e.error)
        console.log('@onerror error at sp = k')
    }
    window.speechSynthesis.speak(utter)
}

function pretty(s, lang) {
    webloader('prettier')

    const prettierRef = {
        js: {
            parser: 'babel',
            plugins: prettierPlugins,
            arrowParens: 'always',
            bracketSpacing: true,
            printWidth: 100,
            tabWidth: 4,
            semi: false,
            singleQuote: true,
        },
        html: {
            parser: 'html',
            plugins: prettierPlugins,
        },
    }

    return prettier.format(s, prettierRef[lang || inferlang(s)])
}


function getFirstClassName(s) {
    return search(/[\w-]+/, s)
}
function getClassNames(x, mode) {
    const fn = mode == 'all' ? split : getFirstClassName

    function getter(s) {
        return findall(/class="(.+?)"/g, s)
    }
    function runner(html) {
        return unique(flat(getter(html).map((x) => fn(x))))
    }

    if (x && isElement(x)) {
        return unique(split(x.className))
    } else {
        return runner(htmlgetter(x))
    }
}

function autoScroll(e) {
    e.scrollTop = e.scrollHeight
}

function elementgetter(el) {
    if (!el) {
        return
    }
    if (isVueNode(el)) {
        return el.$el
    }

    if (isElement(el)) {
        return el
    }

    if (isString(el)) {
        const value =  document.querySelector(fixSelector(el))
        return value
    }
}

function assignStyle(el, style) {
    Object.assign(el.style, style)
}

class StorageSystem {
    constructor(key) {
        this.key = key
        const data = getStorage(key)
        this.storage = new Storage(toStorageSchema(data), { unique: true })
    }

    start(load, unload) {
        if (load) {
            load(this.storage)
        }

        const unloadFn = unload
            ? () => {
                const value = fparse(unload)
                if (value) setStorage(this.key, value)
            }
            : () => {
                if (this.key && exists(this.storage.value)) {
                    setStorage(this.key, this.storage.value)
                }
            }

        window.addEventListener('beforeunload', unloadFn)
    }

    reset() {
        this.storage.reset()
        clearStorage(this.key)
    }

    download() {
        download(this.key + '.lss.json', this.storage.value)
    }
}

function scroll(y) {
    window.scrollTo(0, y)
}

function scrollDown() {
    scroll(1000)
}

function scrollUp() {
    scroll(0)
}

function fullScreenFactory() {
    let count = 0
    let element = document.documentElement

    function openFullscreen() {
        if (element.requestFullscreen) {
            element.requestFullscreen()
        } else if (element.webkitRequestFullscreen) {
            /* Safari */
            element.webkitRequestFullscreen()
        } else if (element.msRequestFullscreen) {
            /* IE11 */
            element.msRequestFullscreen()
        }
    }

    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            /* Safari */
            document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) {
            /* IE11 */
            document.msExitFullscreen()
        }
    }

    return function toggleFullScreen() {
        isEven(count++) ? openFullscreen() : closeFullscreen()
    }
}

function htmlgetter(s) {
    if (!s) {
        return document.body.innerHTML
    }
    if (isElement(s)) {
        return s.innerHTML
    }
    if (isHtml(s)) {
        return s.trim()
    }

    return elementgetter(s).innerHTML
}




function stylegetter(element, ...args) {
    const ref =window.getComputedStyle(element)
    return reduce(args, (x) => {
        const key = toDashCase(x)
        return [key, ref.getPropertyValue(key)]
    })
}
function findElementByText(query, tag = 'div') {
    var xpath = `//${tag}[text()='${query}']` 
    var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    return element
}


function initWindowErrorListener() {
    function onError(error, url, lineNumber) {
        console.log(stringify({ error: error.toString(), url, lineNumber }))
    }
    window.onerror = onError
}


function scrollIntoView(el) {
    
        if (!elementInWindow(el)) {
            el.scrollIntoView({
                block: 'start',
                behavior: 'smooth',
            })
        }
}
function elementInWindow(el) {
    if (el.getBoundingClientRect().bottom > window.innerHeight) {
        return false
    }

    if (el.getBoundingClientRect().top < 0) {
        return true
    }
}
function animationFactory(key, start, end, options = 1000) {
    return function animationRunner(el) {
        const frames = [{[key]: start}, {[key]: end}]
        if (isVueNode(el)) el = el.$el
        if (el.style.visibility == 'none') {
            el.style.visibility = 'block'
        }
        el.style[key] = start
        //scrollIntoView(el)

        const animation = el.animate(frames, options)
        //console.log(animation)
        //console.log(frames)
        return animation.finished.then(() => {
            el.style[key] = end
            return true
        })
    }
}



function createElement(tag = 'div', options = null, parent = document.body) {
    if (tag == 'style' || tag == 'link' || tag == 'script') {
        parent = document.head
    } 

    const element = document.createElement(tag)
    setAttributes(element, options)
    parent.appendChild(element)
    return element
}

function setAttributes(element, options) {
    if (options) {
        for (let [k, v] of Object.entries(options)) {
            if (v) element.setAttribute(k, v)
        }
    }
}
function cssLoader(s, el) {
    if (!exists(s)) {
        return
    }
    if (!el) {
        el = createElement('style')
    }
    const css = cssParseFromString(s)
    dog(css)
    el.innerHTML += css
    return el
}

function addKeyListenerFactory(keypress, gn) {
    return function listener(fn) {
        return window.addEventListener(keypress, (e) => {
            if (gn) gn(e)
            fn(e.key)
        })
    }
}

const toggleFullScreen = fullScreenFactory()
const appear = animationFactory('opacity', 0, 1, 1000)
const disappear = animationFactory('opacity', 1, 0, 1000)


function isMac() {
    return typeof navigator != 'undefined'
        ? /Mac/.test(navigator.platform)
        : false
}


