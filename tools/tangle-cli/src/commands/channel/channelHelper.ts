// Copyright 2021 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Arguments } from "yargs";

export class ChannelHelper {
    public static getEncrypted(args: Arguments): boolean {
        if (args.encrypted) {
            return true;
        }

        return false;
    }

    public static getPrivate(args: Arguments): boolean {
        if (args.private) {
            return true;
        }

        return false;
    }
}
