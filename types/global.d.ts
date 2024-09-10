type FixMeLayer = any

declare module '*.svg' {
  const content: string
  export default content
}
