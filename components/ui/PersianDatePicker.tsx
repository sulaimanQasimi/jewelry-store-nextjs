'use client'

import React from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import gregorian from 'react-date-object/calendars/gregorian'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

const ISO_FORMAT = 'YYYY-MM-DD'

export interface PersianDatePickerProps {
  value: string | null
  onChange: (value: string | null) => void
  className?: string
  placeholder?: string
  disabled?: boolean
  name?: string
}

/** Parse ISO YYYY-MM-DD to a DateObject in Persian calendar for display */
function isoToPersianDateObject(iso: string | null): DateObject | null {
  if (!iso || !iso.trim()) return null
  try {
    const greg = new DateObject({ date: iso, format: ISO_FORMAT, calendar: gregorian })
    return greg.convert(persian, persian_fa)
  } catch {
    return null
  }
}

/** Convert DateObject (Persian) to ISO YYYY-MM-DD */
function dateObjectToIso(d: DateObject | null): string | null {
  if (!d) return null
  try {
    const greg = d.convert(gregorian)
    return greg.toDate().toISOString().slice(0, 10)
  } catch {
    return null
  }
}

export default function PersianDatePicker({
  value,
  onChange,
  className,
  placeholder,
  disabled,
  name
}: PersianDatePickerProps) {
  const pickerValue = React.useMemo(() => isoToPersianDateObject(value), [value])

  const handleChange = (d: DateObject | null) => {
    onChange(dateObjectToIso(d))
  }

  return (
    <DatePicker
      value={pickerValue}
      onChange={handleChange}
      calendar={persian}
      locale={persian_fa}
      format={ISO_FORMAT}
      calendarPosition="bottom-right"
      containerClassName="w-full"
      inputClass={className}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
    />
  )
}
