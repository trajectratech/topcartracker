export function formatPhoneDisplay(phone: string): string {
	const trimmed = phone.trim();
	const digits = trimmed.replace(/\D/g, "");

	if (digits.length === 13 && digits.startsWith("234")) {
		const local = digits.slice(3);
		return `+234 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
	}

	if (digits.length === 11 && digits.startsWith("0")) {
		return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
	}

	return trimmed;
}
