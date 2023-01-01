import { reducer, initialState } from './application.reducer'

describe('Career Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any

      const result = reducer(initialState, action)

      expect(result).toBe(initialState)
    })
  })
})
