# mycalculatordapp-final

This is the completed version of the calculator dapp. To run it:
1. Download or clone the repository onto your computer.
2. Run `npm install` in the main directory of this project.
3. Run `anchor test`.

This version was created for anchor version 0.26.0 following the step by step guide that Arjun explains nicely in his course. There are some naming differences because it was created on my machine using the `anchor init` command and forcibly overwrote the existing repo. The actual notable differences are:
1. This was created on Windows using WSL (installed the Ubuntu 20.04 distribution)
2. In the lib.rs I created and referenced a generic "Operations" struct rather than creating structs for each mathematical operation because they are all the same and use the same account
3. In the lib.rs I included a basic error check which meant the return type of all of the functions had to be the more generalised Result type rather than ProgramResult because I didn't have access to their ProgramError type.
4. In the 0.26.0 of anchor they seem to have completely changed the syntax of the test methods without making ensuring backwards compatibility of the testing framework (whoops!). This was a bit frustrating but hopefully it is clear from my changes how the example test can be adapted. Some examples were provided by the anchor team though on their public repo https://github.com/coral-xyz/anchor/tree/master/examples/tutorial
5. I commented out the migrations/deploy.ts file and added "node" to the types in the tsconfig.json to stop some VSCode errors

As a general side note I found that immediately after making any changes to lib.rs it was worth running `anchor build` in the terminal. This made developing tests easier because the target folder generated a typescript file mapping the program defined in lib.rs into typescript and this was only updated via that command. This was imported and used in the line that defines the variable `program` so that the intellisense was aware of all of the methods that were available on the `program.methods` object. It's not a big deal not running the command every time (it's actually run as part of the `anchor test` command) but I found it useful