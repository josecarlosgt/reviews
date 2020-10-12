const MAX_RATING = 5;
const form = document.getElementById('add-review-form');

/*
	Generates the HTML code to display a rating score as a sequence of stars.
	Each star is represented as a SPAN element at appended to the reviewContainer
	element received as a parameter.
	Reference: https://www.w3schools.com/howto/howto_css_star_rating.asp
*/
function displayReviewStarts(reviewContainer, rating) {
	for(let c = 1; c <= MAX_RATING; c++) {
		let star = document.createElement("span");
		star.classList.add("fa");
		star.classList.add("fa-star");
		if(c <= rating) {
			star.classList.add("checked");
		}
		reviewContainer.append(star);
	}
}

/*
	Displays a list of reviews obtained from a firestore database.
	
	db.collection(<COLLECTION NAME>).get().then(snapshot => { ... } )
	snapshot.docs.forEach(doc => { ... } )
	let docData = doc.data();
 
	Reference: https://github.com/iamshaunjp/firebase-firestore-playlist/blob/lesson-6/app.js
*/
function displayReviews() {
	// Get reference to reviews <ul> container
	let reviewContainer = document.getElementById("reviews"); 
	
	// Clean all content from the reviews container
	reviewContainer.innerHTML = "";
	
	// Get snapshot of the reviews collection
	db.collection('reviews').get().then(snapshot => {
			console.log(snapshot.docs);
			
			// Iterate over all documents in the reviews collection
			snapshot.docs.forEach(doc => {
				// Get data for each document (review)
				let docData = doc.data();
				
				// Create HTML for displaying a review
				let reviewItem = document.createElement("li");
				reviewItem.textContent = docData.review + " ";
				displayReviewStarts(reviewItem, docData.stars);
				reviewContainer.append(reviewItem);
			});
	});
}
displayReviews();

/*
	Adds a review to a firestore database.
	
	Reference: https://github.com/iamshaunjp/firebase-firestore-playlist/blob/lesson-6/app.js	
*/
function addReview(e) {
	// Prevent the default behavior of submitting the form when clicking a <button> element 
	e.preventDefault();
	
	// Get references to HTML fields with the review data: review text and rating
	let starsSelect = document.getElementById("reviewStars");
	let reviewInput = document.getElementById("reviewText");
	// Store the review as a new document in the reviews collection 
    db.collection('reviews').add({
        review: reviewInput.value,
        stars: starsSelect.options[starsSelect.selectedIndex].text
	// Wait until the review is added
    }).then(result => {
		// Clear the HTML fields, so a new review can be added
		reviewInput.value = '';
		starsSelect.selectedIndex = 0;
		
		// Show all reviews 
		displayReviews();
	});

}
form.addEventListener('submit', addReview);
