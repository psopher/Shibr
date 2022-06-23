

// Handles basic form input changes
export const handleChange = (e, setPostErrors, setFormData, formData) => {
  console.log('handleChange runs')
  // console.log('e.target is ->', e.currentTarget)
  // console.log('e.target value is ->', e.target.value)
  // console.log('e.target name is ->', e.target.name)
  // console.log('formData to update is ->', formData)
  const { name, value } = e.target
  console.log('name is ->', name)
  console.log('value is ->', value)

  setPostErrors(false)

  if ( name === 'show_me' || name === 'give_social') {
    const boolValue = value !== 'true' ? true : false
    console.log('boolValue ->', boolValue)
    setFormData({ ...formData, [name]: boolValue })
  } else {
    setFormData({ ...formData, [name]: value })
  }
}

// Handles sliding on the min/max age sliders
export const handleAgeRangeChange = (e, setPostErrors, setFormData, formData) => {
  const { name, value } = e.target
  console.log('handleAgeRangeChange runs')
  console.log('e.target is ->', e.target.value)
  const minAge = e.target.value[0]
  const maxAge = e.target.value[1]
  // console.log('e.target name is ->', e.target.name)
  setPostErrors(false)
  setFormData({ ...formData, min_age: minAge, max_age: maxAge })
}

