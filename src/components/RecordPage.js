import React from 'react'
import getRecords from '../utilities/records'

const RecordPage = ({data}) => {
  const records = getRecords(data)
  return (
    <div className="page">
      RecordPage
    </div>
  )
}

export default RecordPage