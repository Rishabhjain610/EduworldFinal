import { prevUser } from "./UserContextChat";

export async function query() {
	const response = await fetch(
		"ypur Hugging Face API URL here", // Replace with your actual Hugging Face API URL
		{
			headers: {
				Authorization: "Bearer your Hugging Face API Token here", // Replace with your actual Hugging Face API Token
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({"inputs":prevUser.prompt}),
		}
	);
	
	const result = await response.blob();
	
	return result;
}
