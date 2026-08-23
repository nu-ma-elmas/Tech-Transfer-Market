import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

/**
 * Minimal App Shell test. It must stay independent of the placeholder values and of any
 * specific app name, and pass both before and after the placeholders are replaced.
 */
describe('app shell', () => {
  it('renders the landmarks, a non-empty title, and a non-empty description', () => {
    const { container } = render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()

    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toBeInTheDocument()
    expect(title.textContent?.trim()).not.toBe('')

    const description = container.querySelector('.description')
    expect(description).not.toBeNull()
    expect(description?.textContent?.trim()).not.toBe('')
  })

  it('provides a keyboard-focusable primary action', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.tab()
    await user.tab()
    expect(screen.getByRole('link', { name: 'View the first step' })).toHaveFocus()
  })
})
