import { AnchorError } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import * as assert from "assert"
const { SystemProgram } = anchor.web3;

import { Mycalculatordapp } from "../target/types/mycalculatordapp";

// describe("mycalculatordapp", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.Mycalculatordapp as Program<Mycalculatordapp>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

describe('mycalculatordapp', () => {
  // use a local provider
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  // The calculator program that will be executed on the Solana blockchain
  const program = anchor.workspace.Mycalculatordapp as Program<Mycalculatordapp>;

  // The account for the Calculator program that needs creating
  const calculator = anchor.web3.Keypair.generate();

  it('Creates a calculator', async () => {
    await program.methods
      .create('Welcome to the calculator')
      .accounts({
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId

      })
      .signers([calculator])
      .rpc();

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.greeting === 'Welcome to the calculator');
  })

  it('Adds two numbers', async () => {
    await program.methods
      .add(new anchor.BN(1), new anchor.BN(1))
      .accounts({
        calculator: calculator.publicKey
      })
      .rpc();

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(2)));
  })

  it('Subtracts two numbers', async () => {
    await program.methods
      .subtract(new anchor.BN(2), new anchor.BN(1))
      .accounts({
        calculator: calculator.publicKey
      })
      .rpc();

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(1)));
  })

  it('Multiplies two numbers', async () => {
    await program.methods
      .multiply(new anchor.BN(2), new anchor.BN(5))
      .accounts({
        calculator: calculator.publicKey
      })
      .rpc();

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(10)));
  })

  it('Divides two numbers', async () => {
    await program.methods
      .divide(new anchor.BN(13), new anchor.BN(4))
      .accounts({
        calculator: calculator.publicKey
      })
      .rpc();

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(3)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
  })

  it('Cannot divide by zero', async () => {
    try {
      await program.methods
        .divide(new anchor.BN(10), new anchor.BN(0))
        .accounts({
          calculator: calculator.publicKey
        })
        .rpc();
    } catch (error) {
      const err: AnchorError = error;
      assert.ok("Cannot divide by zero" === err.error.errorMessage)
    }
  })
})
