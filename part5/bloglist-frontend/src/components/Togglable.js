import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

//component is wrapped inside of a forwardRef
//so the component can access the ref that is assigned to it.
const Togglable = forwardRef((props, refs) => {
  // buttonLabel is defined as manditory
  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }

  const [visible, setVisible] = useState(false)
   
  //the value of the display property is none if we do not want the component to be displayed
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  //make its toggleVisibility function available outside of the component
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable