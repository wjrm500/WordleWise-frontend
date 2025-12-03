import React, { useState, useContext, useEffect } from 'react'
import { PRESENT, isPastPresentOrFuture } from '../utilities/dates'
import ScopeContext from '../contexts/ScopeContext'
import {
  getUnbeatenStreaks,
  getWinStreaks,
  getXOrBelowStreaks,
  getWeeklyRecords,
  getRollingPeriodRecords,
  getFortnightRecords,
  getMonthlyRecords
} from '../utilities/records'

const RecordPage = ({ data, onRecordClick }) => {
  const { scopeMembers, isPersonalScope } = useContext(ScopeContext)

  // Record type constants
  const CONSECUTIVE_WINS = "consecWin"
  const CONSECUTIVE_DAYS_UNBEATEN = "consecUnbeat"
  const CONSECUTIVE_ONE_BELOW = "consec1"
  const CONSECUTIVE_TWO_BELOW = "consec2"
  const CONSECUTIVE_THREE_BELOW = "consec3"
  const CONSECUTIVE_FOUR_BELOW = "consec4"
  const CONSECUTIVE_FIVE_BELOW = "consec5"
  const WEEKLY_LOW = "weeklyLow"
  const ROLLING_7_LOW = "rolling7Low"
  const FORTNIGHT_LOW = "fortnightLow"
  const ROLLING_14_LOW = "rolling14Low"
  const MONTH_LOW = "monthLow"
  const ROLLING_28_LOW = "rolling28Low"

  // Determine if competitive records should be available
  const canShowCompetitiveRecords = !isPersonalScope && scopeMembers.length > 1

  // Set default based on scope
  const getDefaultRecordType = () => {
    if (canShowCompetitiveRecords) {
      return CONSECUTIVE_WINS
    }
    return CONSECUTIVE_ONE_BELOW
  }

  const [recordType, setRecordType] = useState(getDefaultRecordType())

  // Reset record type if switching scopes and current type is no longer valid
  useEffect(() => {
    const isCompetitiveRecord = recordType === CONSECUTIVE_WINS || recordType === CONSECUTIVE_DAYS_UNBEATEN
    if (isCompetitiveRecord && !canShowCompetitiveRecords) {
      setRecordType(CONSECUTIVE_ONE_BELOW)
    }
  }, [isPersonalScope, scopeMembers.length, recordType, canShowCompetitiveRecords])

  // Get list of usernames for calculation
  const usernames = scopeMembers.map(m => m.username)

  // Create user mapping for display (username -> forename)
  const userMapping = {}
  scopeMembers.forEach(m => userMapping[m.username] = m.forename || m.username)

  const getRecords = (recordType) => {
    switch (recordType) {
      // Competitive records (only in group scope with 2+ members)
      case CONSECUTIVE_WINS:
        return getWinStreaks(data, usernames)
      case CONSECUTIVE_DAYS_UNBEATEN:
        return getUnbeatenStreaks(data, usernames)

      // Personal achievement records (available in both scopes)
      case CONSECUTIVE_ONE_BELOW:
        return getXOrBelowStreaks(data, 1, usernames)
      case CONSECUTIVE_TWO_BELOW:
        return getXOrBelowStreaks(data, 2, usernames)
      case CONSECUTIVE_THREE_BELOW:
        return getXOrBelowStreaks(data, 3, usernames)
      case CONSECUTIVE_FOUR_BELOW:
        return getXOrBelowStreaks(data, 4, usernames)
      case CONSECUTIVE_FIVE_BELOW:
        return getXOrBelowStreaks(data, 5, usernames)

      // Period records (available in both scopes)
      case WEEKLY_LOW:
        return getWeeklyRecords(data, usernames)
      case ROLLING_7_LOW:
        return getRollingPeriodRecords(data, 7, usernames)
      case FORTNIGHT_LOW:
        return getFortnightRecords(data, usernames)
      case ROLLING_14_LOW:
        return getRollingPeriodRecords(data, 14, usernames)
      case MONTH_LOW:
        return getMonthlyRecords(data, usernames)
      case ROLLING_28_LOW:
        return getRollingPeriodRecords(data, 28, usernames)
      default:
        return []
    }
  }

  const records = getRecords(recordType)
  const isStreakRecord = records.length > 0 && records[0].days !== undefined

  const headerRow = (
    <tr>
      <th>#</th>
      <th>User</th>
      <th>{isStreakRecord ? 'Days' : 'Score'}</th>
      <th>Period start</th>
      <th>Period end</th>
    </tr>
  )

  const rows = records.map((record, index) => {
    const isCurrentRecord = isPastPresentOrFuture(record.periodEnd) === PRESENT

    const handleClick = () => {
      const clickData = {
        user: record.user,
        periodStart: record.periodStart,
        periodEnd: record.periodEnd,
        type: recordType,
        value: record.days || record.score
      }
      onRecordClick(clickData)
    }

    return (
      <tr
        key={`${record.user}-${record.periodStart}-${record.periodEnd}-${index}`}
        className={`clickableRow ${isCurrentRecord ? 'currentRecordRow' : ''}`}
        onClick={handleClick}
      >
        <td>{index + 1}</td>
        <td>{userMapping[record.user] || record.user}</td>
        <td>{record.days || record.score}</td>
        <td>{record.periodStart || "-"}</td>
        <td>{record.periodEnd}</td>
      </tr>
    )
  })

  return (
    <div id="recordPage" className="page">
      <select
        onChange={(event) => {
          event.stopPropagation()
          setRecordType(event.target.value)
        }}
        onClick={(event) => event.stopPropagation()}
        value={recordType}
      >
        {canShowCompetitiveRecords && (
          <optgroup label="Competitive records">
            <option value={CONSECUTIVE_WINS}>Consecutive wins</option>
            <option value={CONSECUTIVE_DAYS_UNBEATEN}>Consecutive days unbeaten</option>
          </optgroup>
        )}
        <optgroup label="Personal achievement records">
          <option value={CONSECUTIVE_ONE_BELOW}>Consecutive days scoring 1 or below</option>
          <option value={CONSECUTIVE_TWO_BELOW}>Consecutive days scoring 2 or below</option>
          <option value={CONSECUTIVE_THREE_BELOW}>Consecutive days scoring 3 or below</option>
          <option value={CONSECUTIVE_FOUR_BELOW}>Consecutive days scoring 4 or below</option>
          <option value={CONSECUTIVE_FIVE_BELOW}>Consecutive days scoring 5 or below</option>
        </optgroup>
        <optgroup label="Period records">
          <option value={WEEKLY_LOW}>Lowest score in week (Mon-Sun)</option>
          <option value={ROLLING_7_LOW}>Lowest score in any 7 days</option>
          <option value={FORTNIGHT_LOW}>Lowest score in fortnight (Mon-Sun)</option>
          <option value={ROLLING_14_LOW}>Lowest score in any 14 days</option>
          <option value={MONTH_LOW}>Lowest score in calendar month</option>
          <option value={ROLLING_28_LOW}>Lowest score in any 28 days</option>
        </optgroup>
      </select>
      <div className="tableContainer">
        <table className="table">
          <thead>
            {headerRow}
          </thead>
          <tbody>
            {rows.length > 0 ? rows : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecordPage;
