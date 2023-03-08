type StateProps = { key: string; value: any }

class VanillaState {
  state = new Map<string, StateProps>()
  id: string | undefined = undefined
  template: string | undefined = undefined

  constructor(domId: string) {
    document.addEventListener("DOMContentLoaded", () => {
      this.id = domId
      this.template = document.getElementById(domId)?.innerHTML
      if (!this.template) {
        throw new Error(`Id: ${this.id} is not found!`)
      }
      this.render()
    })
  }
  useState<T>(id: string, value: T, onChange: (v: T) => void) {
    const get = () => {
      const stateObj = this.state.get(id)
      return stateObj && dont_call_me_from_outside_vannila_get_state(stateObj)
    }

    const set = (value: T) => {
      const state = this.state.get(id)
      if (state) {
        state.value = value
        if (onChange) {
          onChange(value)
        }
      } else {
        this.state.set(id, {
          key: `${id}-${Math.floor(Math.random() * 1000000)}`,
          value,
        })
      }

      this.render()
    }
    set(value)
    return { get, set }
  }
  render() {
    if (!this.template) {
      return
    }

    const newDom = document.createElement("div")
    newDom.innerHTML = this.template
    this.state.forEach((stateObj, key) => {
      newDom.innerHTML = newDom.innerHTML.replace(
        new RegExp(`%${key}`, "g"),
        `%${stateObj.key}`
      )
    })

    // If you know better way, please fix it.
    const currentNodeList: any = document.querySelectorAll(`#${this.id} *`)
    const newNodeList: any = newDom.querySelectorAll("*")
    for (let i = 0; i < currentNodeList.length; i++) {
      if (currentNodeList[i].childElementCount === 0) {
        this.state.forEach((stateObj) => {
          if (
            stateObj &&
            newNodeList[i].innerText.includes(`%${stateObj.key}`)
          ) {
            const state = dont_call_me_from_outside_vannila_get_state(stateObj)
            newNodeList[i].innerText = newNodeList[i].innerText.replace(
              `%${stateObj.key}`,
              state
            )
          }
        })
        if (!currentNodeList[i].isEqualNode(newNodeList[i])) {
          currentNodeList[i].innerText = newNodeList[i].innerText
        }
      }

      if (newNodeList[i].dataset.visible) {
        const stateObj = this.state.get(newNodeList[i].dataset.visible)
        if (!stateObj) {
          throw new Error(
            `The state ${newNodeList[i].dataset.visible} is not defined!`
          )
        }
        const state = dont_call_me_from_outside_vannila_get_state(stateObj)
        currentNodeList[i].style.display = state
          ? newNodeList[i].style.display
          : "none"
      }
    }
  }
}

function dont_call_me_from_outside_vannila_get_state(s: StateProps) {
  const state = s.value
  if (typeof state === "function") {
    return state()
  } else {
    return state
  }
}
