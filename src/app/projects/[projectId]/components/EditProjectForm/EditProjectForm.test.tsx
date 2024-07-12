import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { EditProjectForm } from './EditProjectForm'
import { Project } from '@prisma/client'

// Mock the updateProject function
jest.mock('@/app/projects/[projectId]/actions/update-project', () => ({
  updateProject: jest.fn(),
}))

const mockUpdateProject =
  require('@/app/projects/[projectId]/actions/update-project').updateProject

describe('EditProjectForm', () => {
  const mockProject: Project = {
    id: 1,
    title: 'Test Project',
    subhead: '',
    description: '',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  /**
   * Immediate UI Updates:
   * This test verifies that the UI updates immediately when the 'Project Title' is changed
   * in the form and triggers an auto-save after the debounce delay.
   */
  test('updates UI immediately on input change', async () => {
    render(<EditProjectForm project={mockProject} />)

    const titleInput = screen.getByLabelText('Project Title')
    fireEvent.change(titleInput, { target: { value: 'New Project Title' } })

    // Expect the Project Title in the header to update immediately
    const projectTitleHeader = screen.getByTestId('project-title-header')
    expect(projectTitleHeader.textContent).toBe('New Project Title')

    // Wait for debounce delay
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100)) // Ensure longer than debounce (1000ms)
    })
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockUpdateProject).toHaveBeenCalledWith({
      id: 1,
      title: 'New Project Title',
      subhead: '',
      description: '',
    })
  })

  /**
   * Rapid Tabbing Between Fields:
   * This test simulates rapid changes across different fields and ensures that only one save
   * operation is triggered after the debounce delay.
   */
  test('respects debounce on rapid input changes', async () => {
    render(<EditProjectForm project={mockProject} />)

    const titleInput = screen.getByLabelText('Project Title')
    const subheadInput = screen.getByLabelText('Project Subhead')
    const descriptionInput = screen.getByLabelText('Project Description')

    // Simulate rapid changes across different fields
    fireEvent.change(titleInput, { target: { value: 'New Title' } })
    fireEvent.change(subheadInput, { target: { value: 'New Subhead' } })
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } })

    // Wait for debounce delay (adjust timing if needed)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100)) // Ensure longer than debounce (1000ms)
    })

    // Expect only one call to updateProject after debounce period
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockUpdateProject).toHaveBeenCalledWith({
      id: 1,
      title: 'New Title',
      subhead: 'New Subhead',
      description: 'New Description',
    })
  })

  /**
   * This test simulates concurrent user input on multiple form fields (title and subhead),
   * ensuring that changes trigger re-renders but the save operation is triggered only once
   * after the debounce delay (1000ms).
   */
  test('debounces input changes and triggers save after delay', async () => {
    render(<EditProjectForm project={mockProject} />)

    const titleInput = screen.getByLabelText('Project Title')
    const subheadInput = screen.getByLabelText('Project Subhead')

    // Start typing in the title field
    fireEvent.change(titleInput, { target: { value: 'Title A' } })

    // Expect the title in the header to update immediately
    const titleHeader = screen.getByTestId('project-title-header')
    expect(titleHeader.textContent).toBe('Title A')

    // Wait for a short period (shorter than debounce delay)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Shorter than debounce delay
    })

    // Start typing in the subhead field while save is still in progress for title
    fireEvent.change(titleInput, { target: { value: 'Updated Title A' } })
    fireEvent.change(subheadInput, { target: { value: 'Subhead test' } })

    // Expect the title in the header to update immediately
    const updatedTitleHeader = screen.getByTestId('project-title-header')
    expect(updatedTitleHeader.textContent).toBe('Updated Title A')

    // Wait for debounce delay
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100)) // Ensure longer than debounce (1000ms)
    })

    // Expect only one call to updateProject after debounce period
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockUpdateProject).toHaveBeenCalledWith({
      id: 1,
      title: 'Updated Title A',
      subhead: 'Subhead test',
      description: '',
    })
  })

  /**
   * User Types During "Save":
   * This test verifies the behavior of the auto-save feature when the user continues
   * typing in the 'Project Title' field while a save operation is already in progress
   * due to previous input. It ensures that the debounce mechanism correctly accumulates
   * changes and triggers separate save operations for each input event after the debounce
   * delay has elapsed.
   */
  test('handles input while save is in progress', async () => {
    render(<EditProjectForm project={mockProject} />)

    const titleInput = screen.getByLabelText('Project Title')

    // Start typing in the title field
    fireEvent.change(titleInput, { target: { value: 'Title A' } })

    // Expect the title in the header to update immediately
    const titleHeader = screen.getByTestId('project-title-header')
    expect(titleHeader.textContent).toBe('Title A')

    // Wait for debounce delay to ensure save is triggered after 1000ms
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100)) // Ensure longer than debounce (1000ms)
    })

    // Start typing in the title field again while the first save is still processing
    fireEvent.change(titleInput, { target: { value: 'Updated Title A' } })

    // Expect the title in the header to update immediately
    const updatedTitleHeader = screen.getByTestId('project-title-header')
    expect(updatedTitleHeader.textContent).toBe('Updated Title A')

    // Wait for debounce delay again to ensure save is triggered after 1000ms
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100)) // Ensure longer than debounce (1000ms)
    })

    // Expect two calls to updateProject: one for each change event
    expect(mockUpdateProject).toHaveBeenCalledTimes(2)
    expect(mockUpdateProject).toHaveBeenNthCalledWith(1, {
      id: 1,
      title: 'Title A',
      subhead: '',
      description: '',
    })
    expect(mockUpdateProject).toHaveBeenNthCalledWith(2, {
      id: 1,
      title: 'Updated Title A',
      subhead: '',
      description: '',
    })
  })
})
