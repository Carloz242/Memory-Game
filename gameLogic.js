const shuffleCards = (cardList) => {

    let randomIndexCards = [];

    while (randomIndexCards.length !== cardList.length) {

        let randomNumber = Math.floor(Math.random() * cardList.length);
       
        if (!randomIndexCards.includes(randomNumber)) {
            randomIndexCards.push(randomNumber);
        }
    };
    return randomIndexCards.map(index => cardList[index]);
};

const checkMatchCards = (indexCardSelected, randomCardList) => {
   return indexCardSelected.map(index =>  randomCardList[index]);
}

const gameLogic = {
    shuffleCards,
    checkMatchCards
};

export default gameLogic;

