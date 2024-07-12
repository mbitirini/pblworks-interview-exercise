'use client'

import { updateProject } from '@/app/projects/[projectId]/actions/update-project'
import { Grid, Paper, TextField, Typography } from '@mui/material'
import { Project } from '@prisma/client'
import { useState } from 'react'
import useDebounce from '@/app/projects/hooks/useDebounce'

export const EditProjectForm = ({ project }: { project: Project }) => {
  const [title, setTitle] = useState(project.title)
  const [subhead, setSubhead] = useState(project.subhead)
  const [description, setDescription] = useState(project.description)

  const onSave = async () => {
    try {
      await updateProject({
        id: project.id,
        title,
        subhead,
        description,
      })
    } catch (error: unknown) {
      console.error('Error while trying to update project', {
        project: { id: project.id, title, description, subhead },
        error,
      })
    }
  }

  // Debounce the onSave function to handle delayed saving after user input stops
  const debouncedSave = useDebounce(onSave)

  // Update the project title state and trigger debounced save
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    debouncedSave()
  }

  // Update the project subhead state and trigger debounced save
  const handleSubheadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubhead(event.target.value)
    debouncedSave()
  }

  // Update the project description state and trigger debounced save
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value)
    debouncedSave()
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h2" data-testid="project-title-header">
        {title || 'Untitled Project'}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12} md={5} lg={4}>
          <TextField
            fullWidth
            label="Project Title"
            value={title}
            placeholder="Enter the project title, eg. 'Power of the punch'"
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <TextField
            fullWidth
            label="Project Subhead"
            value={subhead}
            placeholder="Use a small sentence to describe the project, eg. 'Students will learn Newtons Laws while constructing a boxing glove'"
            onChange={handleSubheadChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Project Description"
            value={description}
            placeholder="Describe the project in detail (suggested length: 300 words)"
            onChange={handleDescriptionChange}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
