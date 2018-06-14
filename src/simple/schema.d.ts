export interface Schema {
    /**
     * The name of the project.
     */
    project: string;
    /**
     * The path to create the interface.
     */
    path?: string;
    /**
     * Specifies if we should overwrite existing files.
     */
    overwrite: boolean;
}
