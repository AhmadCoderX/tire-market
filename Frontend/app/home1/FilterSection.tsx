"use client"

import { useState } from "react"

interface FilterSectionProps {
  title: string
  options: string[]
}

export default function FilterSection({ title, options }: FilterSectionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  return (
    <div className="py-0">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {selectedOptions.length > 0 && (
          <button
            className="bg-[#5B7560] text-white text-xs font-medium py-1 px-2 rounded"
            onClick={() => setSelectedOptions([])}
          >
            Clear
          </button>
        )}
      </div>
      <div className="space-y-1">
        {options.map((option) => (
          <div key={option} className="flex items-center py-0.5" onClick={() => toggleOption(option)}>
            <div className="mr-2">
              <div
                className={`w-3.5 h-3.5 rounded border ${
                  selectedOptions.includes(option) ? "bg-[#5B7560] border-[#5B7560]" : "bg-white border-gray-300"
                } flex justify-center items-center`}
              >
                {selectedOptions.includes(option) && <span className="text-white text-[10px] leading-3.5">✓</span>}
              </div>
            </div>
            <span className="text-sm text-gray-600">{option}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

