import {
    apply,
    branchAndMerge,
    chain, MergeStrategy,
    mergeWith,
    move,
    Rule,
    SchematicContext,
    template,
    Tree, url
} from '@angular-devkit/schematics';
import {getWorkspace} from "@schematics/angular/utility/config";
import {buildDefaultPath} from "@schematics/angular/utility/project";
import {parseName} from "@schematics/angular/utility/parse-name";
import {strings} from '@angular-devkit/core';
import {Schema as SimpleSchema} from './schema';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function simple(options: SimpleSchema): Rule {
    return (host: Tree, context: SchematicContext) => {

        const workspace = getWorkspace(host);
        const project = workspace.projects[options.project];

        if (options.path === undefined) {
            options.path = buildDefaultPath(project);
        }

        const parsedPath = parseName(options.path, options.project);
        options.project = parsedPath.name;
        options.path = parsedPath.path;

        const templateSource = apply(url('./files'), [
            template({
                ...strings,
                ...options,
            }),
            move(parsedPath.path),
        ]);

        const mergeStrategy = (options.overwrite) ? MergeStrategy.Overwrite : MergeStrategy.Default;

        const rule = chain([
            branchAndMerge(chain([
                mergeWith(templateSource, mergeStrategy)
            ]), mergeStrategy)
        ]);
        return rule(host, context);
    };
}
