export const getExtensionLink = () => {
	const { userAgent } = navigator;
	let extensionLink;

	if (userAgent.match(/chrome|chromium|crios/i)) {
		extensionLink =
			"https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
	} else if (userAgent.match(/firefox|fxios/i)) {
		extensionLink =
			"https://addons.mozilla.org/pt-BR/firefox/addon/ether-metamask/";
	} else if (userAgent.match(/opr\//i)) {
		extensionLink =
			"https://addons.opera.com/pt-br/extensions/details/metamask-10/";
	} else if (userAgent.match(/edg/i)) {
		extensionLink =
			"https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm";
	} else {
		extensionLink = "";
	}

	return extensionLink;
};
