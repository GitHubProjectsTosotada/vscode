/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as os from 'os';

export async function readCertificates() {
	if (process.platform === 'win32') {
		const winCA = require.__$__nodeRequire<any>('win-ca-lib');

		let ders = [];
		const store = winCA();
		try {
			let der;
			while (der = store.next()) {
				ders.push(der);
			}
		} finally {
			store.done();
		}

		const seen = {};
		return ders.map(derToPem)
			.filter(pem => !seen[pem] && (seen[pem] = true));
	}
	return undefined;
}

function derToPem(blob) {
	const lines = ['-----BEGIN CERTIFICATE-----'];
	const der = blob.toString('base64');
	for (let i = 0; i < der.length; i += 64) {
		lines.push(der.substr(i, 64));
	}
	lines.push('-----END CERTIFICATE-----', '');
	return lines.join(os.EOL);
}
