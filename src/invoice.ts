import fetch from 'cross-fetch';
import { getHashFromInvoice } from "./utils/invoice";
import Hex from "crypto-js/enc-hex";
import sha256 from "crypto-js/sha256";

export default class Invoice {
  paymentRequest: string;
  paymentHash: string;
  preimage: string;
  verify: string;

  constructor(lnUrlPayResponse: {pr: string, verify: string, preimage?: string}) {
    this.paymentRequest = lnUrlPayResponse.pr;
    this.verify = lnUrlPayResponse.verify;
    this.paymentHash = getHashFromInvoice(this.paymentRequest) as string;
    this.preimage = lnUrlPayResponse.preimage ?? '';
  }

  async isPaid(): Promise<boolean> {
    if (this.preimage)
      return this.validatePreimage(this.preimage);
    else if (this.verify) {
      return await this.verifyPayment();
    } else {
      throw new Error('Could not verify payment');
    }
  }

  validatePreimage(preimage: string): boolean {
    if (!preimage || !this.paymentHash) return false
  
    try {
      const preimageHash = sha256(preimage).toString(Hex)
      return this.paymentHash === preimageHash
    } catch {
      return false
    }
  }

  async verifyPayment(): Promise<boolean> {
    if (!this.verify) throw new Error('LNURL verify not available');

    const result = await fetch(this.verify);
    const json = await result.json();
  
    return json.settled;
  }
}