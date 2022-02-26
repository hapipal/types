import * as Hapi from "@hapi/hapi";
import * as Schwifty from "@hapipal/schwifty";


import DogModel from "./test/dog";

export declare type TypeScriptVersion = '4.0' | '4.1' | '4.2' | '4.3' | '4.4' | '4.5';



declare module '@hapipal/schwifty' {

    type AuthModels = {
        Members: Schwifty.ModelClass
        Admin: Schwifty.ModelClass
        Mananger: Schwifty.ModelClass
    }

    type OathModels = {
        Witness: Schwifty.ModelClass
        Promissory: Schwifty.ModelClass
        CrownCourt: Schwifty.ModelClass
    }

    interface SchwiftyDecorator {
        (namespace: 'auth'): AuthModels
        (namespace: 'oath'): OathModels
    }
}

(async () => {
    const server = new Hapi.Server({ port: 3000 });

    //
    await server.register(Schwifty);
    await server.register({
        plugin: Schwifty.plugin,
        options: {
            knex: {
                client: "sqlite3",
                useNullAsDefault: true,
                connection: {
                    filename: ":memory:"
                }
            }
        }
    });

    Schwifty.assertCompatible(DogModel, DogModel);
    // Register a model with schwifty...

    server.schwifty(DogModel);

    await server.initialize();
    const { Dog } = server.models();

    // These are undefined in real implementation but
    // still satisfy typings constraints
    const { Mananger, Members, Admin } = server.models('auth');
    const { CrownCourt, Promissory, Witness } = server.models('oath');

    await Dog.query().insert({ name: "Guinness" });


})();