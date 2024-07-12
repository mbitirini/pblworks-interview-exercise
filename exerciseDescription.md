# Auto-Save Feature Implementation

## Custom Hook: useDebounce

### Purpose

The `useDebounce` hook is designed to debounce a callback function, ensuring that it is called only after a specified delay period. This helps in handling frequent state updates efficiently without causing unnecessary calls with every re-render.

### Logic

`useRef`: Used to store the latest version of the callback function

`useEffect`: Updates the `ref` whenever the callback function changes to ensure the latest function is always called

`useMemo`: Memoizes the debounced callback function, created using Lodash’s debounce method, to avoid recreating the debounced function on every render

### Benefits

- Performance Optimization: Reduces the frequency of function calls, particularly useful for handling rapid user inputs

- Minimized Unnecessary Calls: Prevents frequent state updates from triggering immediate save operations, providing a smoother user experience

## Integration with EditProjectForm

- Form State Management: The form manages the state for title, subhead and description using `useState`

- Debounced Save Function: The `onSave` function is responsible for updating the project in the database. This function is debounced using the `useDebounce` hook to ensure that it is called only after a delay, reducing the number of update operations

- Generalized Change Handler: A `handleChange` function is created to handle state updates for different fields and trigger the debounced save function.

### Benefits

- Efficiency: The debounced save function ensures that the project details are saved only after a specified delay, reducing the number of save operations.

- Code Reusability: The `handleChange` function, combined with the state setters, makes the code more modular and reusable.

## Testing the Auto-Save Feature

### Test Scenarios

- Immediate UI Updates: Ensures that the UI updates immediately when the input fields change.

- Debounced Save: Verifies that the save function is debounced correctly and called only after the specified delay.

- Rapid Input Changes: Tests that rapid changes across different fields result in a single save operation after the debounce delay.

- Input During Save: Ensures that new inputs during an ongoing save trigger a subsequent save after the debounce delay.
