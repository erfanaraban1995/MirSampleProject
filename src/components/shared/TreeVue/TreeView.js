export default class TreeView {
  constructor(items, {value = [], searchable = false, delay = 300, ...options} = {}) {
    this.options = options
    this.delay = delay
    this.searchable = searchable
    this.items = items
    this.initBtnOptions(options)
    this.initEvents(options)
    this.initMethods(options)
    this.initClasses(options)

    this.initHtmlStructur(options)
    this.value = new Set(value)

    this.renderBody()
  }
  renderBody() {
    this.renderItems()
    this.initTree()
  }
  get icon() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor">
      <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z"/>
      </svg>
    `
  }
  initBtnOptions(options) {
    const {resetBtn = {}, searchBtn = {}, inputAttrs = {}} = options
    this.inputAttrs = {placeholder: 'search', ...inputAttrs}
    this.resetBtn = {class: 'btn-light', style: '', text: 'Reset', ...resetBtn}
    this.searchBtn = {class: 'btn-primary', style: '', text: 'Search', ...searchBtn}
  }
  debounce(cb) {
    let timer = null
    return (...args) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        cb.apply(this, args)
      }, this.delay)
    }
  }

  initClasses() {
    const {
      wrapperClass = '',
      itemClass = '',
      childrenWrapperClass = '',
      togglerClass = '',
      checkboxClass = '',
      checkboxLabelClass = '',
      checkboxInputClass = ''
    } = this.options

    this.wrapperClass = wrapperClass
    this.itemClass = itemClass
    this.childrenWrapperClass = childrenWrapperClass
    this.togglerClass = togglerClass
    this.checkboxClass = checkboxClass
    this.checkboxLabelClass = checkboxLabelClass
    this.checkboxInputClass = checkboxInputClass
  }
  initEvents(options) {
    const {onChange, onSelect, onUnselect} = options
    const defaultHandler = () => {}
    this.onChange = this.debounce(onChange || defaultHandler)
    this.onSelect = onSelect || defaultHandler
    this.onUnselect = onUnselect || defaultHandler
  }
  initMethods(options) {
    const defaultGetText = (item) => item.name
    const defaultGetTerm = (item) => item.name
    const defaultGetValue = (item) => item.id
    const defaultGetParentValue = (item) => item.parentIdFk
    const {getText, getValue, getParentValue, getTerm, comparator} = options

    this.getText = getText || defaultGetText
    this.getTerm = getTerm || defaultGetTerm
    this.getValue = getValue || defaultGetValue
    this.getParentValue = getParentValue || defaultGetParentValue

    const defaultComparator = function(term, item) {
      if (!term) return true
      return this.getTerm(item)
        .toLowerCase()
        .includes(term.toLowerCase())
    }
    this.comparator = comparator || defaultComparator
  }
  initHtmlStructur(options) {
    const {el, id} = options
    this.rootElement = el || document.getElementById(id)
    this.rootElement.classList.add('tree-view')

    this.bodyElement = document.createElement('div')
    this.bodyElement.setAttribute('id', 'tree-view-body')

    this.rootElement.appendChild(this.bodyElement)
  }
  debounceSearch(term) {
    this.debounce(this.search)(term)
  }
  search(term) {
    if (!term) return this.reset()
    this.clearBody()
    const filteredItems = this.filterItemsByTerm(this.items, term)
    this.renderItems(this.bodyElement, filteredItems)
    this.initTree()
  }
  clearBody() {
    this.bodyElement.innerHTML = ''
  }
  reset() {
    this.clearBody()
    this.renderBody()
  }
  expandAll() {
    for (const item of this.rootElement.querySelectorAll('.tv-wrapper')) {
      item.classList.add('show')
    }
  }
  collapseAll() {
    for (const item of this.rootElement.querySelectorAll('.tv-wrapper')) {
      item.classList.remove('show')
    }
  }
  filterItemsByTerm(items, term) {
    return items
      .filter((item) => {
        if (item.children.length > 0) return this.hasChildrenByTerm(item.children, term)
        return this.comparator(term, item)
      })
      .map((item) => {
        return {
          ...item,
          children: this.filterItemsByTerm(item.children, term)
        }
      })
  }
  hasChildrenByTerm(items, term) {
    return items.some((item) => {
      if (item.children.length > 0) return this.hasChildrenByTerm(item.children, term)
      return this.comparator(term, item)
    })
  }
  createCheckBoxElement(item) {
    const value = this.getValue(item)
    const hasChildren = !!item.children.length
    if (hasChildren) {
      this.value.delete(value)
    }
    const toggleIcon = document.createElement('span')
    toggleIcon.setAttribute('class', `tv-toggler ${this.togglerClass}`)

    if (!hasChildren) {
      toggleIcon.classList.add('invisible-toggler')
    }
    toggleIcon.innerHTML = this.icon

    const label = document.createElement('label')
    label.setAttribute('class', `tv-checkbox-label ${this.checkboxLabelClass}`)
    label.setAttribute('for', value)

    const input = document.createElement('input')
    input.checked = this.value.has(value)
    input.setAttribute('class', `tv-checkbox-input ${this.checkboxInputClass}`)
    input.setAttribute('type', 'checkbox')
    input.setAttribute('value', value)
    input.setAttribute('id', value)
    input.setAttribute('has-child', hasChildren)
    input.setAttribute('parent-value', this.getParentValue(item))
    input.addEventListener('input', () => this.onChangeElement(input))

    const checkboxItem = document.createElement('span')
    checkboxItem.setAttribute('class', `tv-checkbox ${this.checkboxClass}`)
    checkboxItem.appendChild(input)
    checkboxItem.appendChild(label)

    const TVItem = document.createElement('div')
    TVItem.setAttribute('class', `tv-item ${this.itemClass}`)

    const wrapper = document.createElement('div')
    wrapper.setAttribute('class', `tv-wrapper ${this.wrapperClass}`)

    toggleIcon.addEventListener('click', () => {
      wrapper.classList.toggle('show')
      // if (wrapper.classList.contains('show')) {
      //   toggleIcon.innerHTML = this.icon
      // } else {
      //   toggleIcon.innerHTML = this.icon
      // }
    })

    TVItem.appendChild(toggleIcon)
    TVItem.appendChild(checkboxItem)
    label.innerHTML = this.getText(item)
    wrapper.appendChild(TVItem)

    return wrapper
  }
  renderItems(element = this.bodyElement, items = this.items) {
    const childrenWrapper = document.createElement('div')
    childrenWrapper.setAttribute('class', `tv-children-wrapper ${this.childrenWrapperClass}`)

    for (const item of items) {
      const itemElement = this.createCheckBoxElement(item)
      childrenWrapper.appendChild(itemElement)
      element.appendChild(childrenWrapper)
      this.renderItems(itemElement, item.children)
    }
  }
  initTree() {
    const checkedElements = [...this.rootElement.querySelectorAll('input:checked')]
    for (const element of checkedElements) {
      this.initElement(element)
    }
  }
  getElementValue(element) {
    return +element.getAttribute('value')
  }
  getElementParentValue(element) {
    return +element.getAttribute('parent-value')
  }
  initElement(element) {
    element.indeterminate = false
    this.syncChildren(element)
    this.syncParents(element)
  }
  onChangeElement(element) {
    element.indeterminate = false
    this.syncValueByItem(element)
    this.syncChildren(element)
    this.syncParents(element)
  }
  syncChildren(element) {
    const value = this.getElementValue(element)
    const checked = element.checked
    const children = document.querySelectorAll(`[parent-value="${value}"]`)
    for (const child of children) {
      child.checked = checked
      child.indeterminate = false
      this.syncValueByItem(child)
      this.syncChildren(child)
    }
  }
  getElementByValue(value) {
    return document.querySelector(`[value="${value}"]`)
  }
  syncParents(element) {
    const parentValue = this.getElementParentValue(element)
    const parentElement = this.getElementByValue(parentValue)
    if (!parentElement) return
    this.updateElementStatusByChilds(parentElement)
    this.syncParents(parentElement)
  }
  childrenStatus(value) {
    const children = [...document.querySelectorAll(`[parent-value="${value}"]`)]
    const allChecked = children.every((item) => item.checked)
    const allUnchecked = children.every((item) => !item.checked)
    const someIndeterminate = children.some((item) => item.indeterminate)
    return {
      allChecked,
      someChecked: !allChecked && !allUnchecked,
      allUnchecked,
      someIndeterminate
    }
  }
  updateElementStatusByChilds(element) {
    const value = this.getElementValue(element)
    const childrenStatus = this.childrenStatus(value)
    if (childrenStatus.allChecked) {
      element.indeterminate = false
      element.checked = true
    } else {
      element.checked = false
      if (childrenStatus.someIndeterminate || childrenStatus.someChecked) {
        element.indeterminate = true
      } else {
        element.indeterminate = false
      }
    }
    this.syncValueByItem(element)
  }
  syncValue() {
    const newValue = [...this.rootElement.querySelectorAll('input')]
      .filter((item) => item.checked)
      .map((item) => this.getElementValue(item))
    this.value = new Set(newValue)
    this.onChange(newValue)
  }
  syncValueByItem(element) {
    if (element.getAttribute('has-child') === 'true') return
    const value = this.getElementValue(element)
    if (element.checked === this.value.has(value)) return

    if (element.checked) {
      this.value.add(value)
    } else {
      this.value.delete(value)
    }
    this.onChange([...this.value])
  }
}
