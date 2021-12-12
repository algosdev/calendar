import { Box } from '@mui/system'
import { useState } from 'react'
const palette = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c']
export default function ColorPicker({ value, onChange }) {
  const [selected, setSelected] = useState()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '16px',
      }}
    >
      {palette.map((el, index) => (
        <Box
          key={index}
          sx={{
            background: el,
            width: 24,
            height: 24,
            marginRight: 1,
            cursor: 'pointer',
            border: `2px solid ${selected === index ? 'black' : 'transparent'}`,
          }}
          onClick={() => {
            setSelected(index)

            onChange(el)
          }}
        />
      ))}
      <input
        type='color'
        style={{ width: 32, height: 32, background: 'transparent' }}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setSelected()
        }}
      />
    </Box>
  )
}
