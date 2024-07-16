import { IModel, IPlugin, IStack } from "@spikedpunch/stacks";
export type TestHandler = (scenario: TestScenario) => Promise<void>;
export type HookHandler = () => Promise<void>;
export type TestContext = {
    plugin?: IPlugin;
    hooks?: {
        beforeAll?: HookHandler;
        beforeTest?: HookHandler;
        afterTest?: HookHandler;
        afterAll?: HookHandler;
    };
};
export type TestScenario = {
    stack: IStack;
    models: IModel[];
};
export declare class TestSuite {
    readonly context: TestContext;
    private tests;
    private constructor();
    static create(context: TestContext): Promise<TestSuite>;
    addAllTests(): TestSuite;
    /**
     * Create a custom Test against the provided TestContext
     *
     * @param name The Name of the Test
     * @param handler The test to run
     * @returns
     */
    custom(name: string, handler: TestHandler): TestSuite;
    /**
     * Creates and retrieves Models
     * @returns
     */
    getModel(): TestSuite;
    /**
     * Creates and retrieves Models by ID
     * @returns
     */
    getModelById(): TestSuite;
    /**
     * Creates and retrieves Models
     * @returns
     */
    getModels(): TestSuite;
    /**
     * Creates a StackObject and retrieves it
     * @returns
     */
    getObject(): TestSuite;
    /**
     * Double saves an Object to ensure only one exists when retrieving
     * @returns
     */
    doubleObjectSave(): TestSuite;
    /**
     * Creates a Model and ensures it exists (using the create() api)
     * @returns
     */
    createModel(): TestSuite;
    createObject(): TestSuite;
    run(): Promise<void>;
    private createScenario;
    private test;
    /**
     * Validates that two Models are equal
     *
     * @param primary The Primary Model
     * @param other The Other Model
     */
    private validateModel;
}
