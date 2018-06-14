import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {Schema as ApplicationOptions} from '@schematics/angular/application/schema';
import {Schema as WorkspaceOptions} from '@schematics/angular/workspace/schema';

const collectionPath = path.join(__dirname, '../collection.json');


describe('simple', () => {

    const schematicRunner = new SchematicTestRunner(
        '@schematics/angular',
        path.join(__dirname, '..', '..', 'node_modules', '@schematics', 'angular', 'collection.json')
    );

    const workspaceOptions: WorkspaceOptions = {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
    };

    const appOptions: ApplicationOptions = {
        name: 'bar',
        inlineStyle: false,
        inlineTemplate: false,
        routing: false,
        style: 'css',
        skipTests: false,
        skipPackageJson: false,
    };

    let appTree: UnitTestTree;
    beforeEach(() => {
        appTree = schematicRunner.runSchematic('workspace', workspaceOptions);
        appTree = schematicRunner.runSchematic('application', appOptions, appTree);
    });

    it('works with overwrite', () => {
        const runner = new SchematicTestRunner('simple', collectionPath);
        const tree = runner.runSchematic('simple', {
            project: 'bar',
            overwrite: true
        }, appTree);

        expect(tree.readContent('/projects/bar/src/app/app.component.html')).toEqual('I\'m new!');
    });

    it('skips without overwrite', () => {
        const runner = new SchematicTestRunner('simple', collectionPath);
        const tree = runner.runSchematic('simple', {
            project: 'bar',
            overwrite: false
        }, appTree);

        expect(tree.readContent('/projects/bar/src/app/app.component.html')).not.toEqual('I\'m new!');
    });
});
