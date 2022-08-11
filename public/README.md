# JunoSwap Asset List

These files are used by the JunoSwap interface to determine which assets are available and find relevant chain information. Direct links to these files should be configured in the JunoSwap env file.

## Important Security Info

Before adding any assets, query the contract and ensure it is instantiated from the proper byte code. The metadata should also be checked with `wasmd q wasm contract <contract-address>` to ensure an admin is not set as this could put users liquidity at risk. 

## Token List

This file determines the assets available.

## IBC Assets

This file determines the assets that can be deposited and withdrawn via IBC.

## Chain Info

This file provides configuation to Keplr for interacting with the chain.
