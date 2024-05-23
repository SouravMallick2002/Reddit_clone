import React from 'react'

export type TextInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export function TextInput(props: TextInputProps) {
    return (
        <input
            style={{
                border: '1px solid gray',
                borderRadius: '8px',
                padding: '0 12px',
                height: '36px',
                maxWidth:"100%",
            }}
            {...props}
        />
    )
}