import type { Global, GlobalDocument } from '../types'

export const _window = window as unknown as Global;
export const _document = document as unknown as GlobalDocument
export const _performance = _window.performance