import { halRootDirectory } from "./halRootDirectory.mjs"

/* Primary application directories */
export const componentDirectory = [...halRootDirectory, 'src', 'modularAssets', 'library']
export const libraryStyleDirectory = [...halRootDirectory, 'src', 'modularAssets', 'stylesheets']
export const bundlesDirectory = [...componentDirectory, 'bundles']
