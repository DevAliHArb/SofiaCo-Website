import React from 'react'
import './textfield.css'

const TextField = (props) => {
  return (
    <>
  {props.rows == 1 && <div class="input-container">
  <input placeholder={props.placeholder} maxLength={props.maxLength} class="input-field" type="text" color='white' value={props.value} aria-multiline onChange={props.onChange}/>
  <label for="input-field" class="input-label">{props.label}</label>
  <span class="input-highlight"></span>
</div>}
{props.rows > 1 && <div class="input-container">
  <textarea rows={props.rows} maxLength={props.maxLength} placeholder={props.placeholder} class="textarea-field" type="text" color='white' value={props.value} aria-multiline onChange={props.onChange}/>
  <label for="input-field" class="input-label">{props.label}</label>
  <span class="input-highlight"></span>
</div>}
</>
  )
}
 
export default TextField