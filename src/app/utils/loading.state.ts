export type LoadingState<T> = {
  loading: Record<keyof T, boolean>
}

export function setLoadingGeneric<T>(state: LoadingState<T>, key: keyof T, loading: boolean): Record<keyof T, boolean> {
  return { ...state.loading, [key]: loading }
}
