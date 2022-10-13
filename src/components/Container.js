import PropTypes from 'prop-types'
import React from 'react'

const Container = (props) => {
  return (
    <div>{props.title}</div>
  )
}

Container.propTypes = {
    title: PropTypes.string.isRequired
}

export default Container