<template>
<div>
    <header id="header" class="header">
        <h1 class="header__title"><img src="../assets/icon-left-font-monochrome-white.png" alt="Logo Groupomania Blanc" class="header__logo"></h1>
        <nav class="header__nav">
            <button @click="loginWindow = true; signupWindow = false" class="header__nav__login header__btn">
                Se connecter
            </button>
            <button @click="loginWindow = false; signupWindow = true" class="header__nav_signup header__btn">
                S'inscrire
            </button>
        </nav>
    </header>
    
    <main id="main" class="main">
        <div v-if="loginWindow" class="main__form">
            <div class="form">
                <div>
                    <label for="user-id">Identifiant</label>
                    <input id="user-id" type="email" placeholder="Email" aria-label="email">
                </div>
                <div>
                    <label for="user-pw">Mot de passe</label>
                    <input id="user-pw" type="password" placeholder="Mot de passe" aria-label="mot de passe">
                </div>
            </div>
            
            <button @click="login()" class="form__btn">Se connecter</button>

            <p>Pas encore inscrit? <span><a href="#" @click="loginWindow = false; signupWindow = true">S'inscrire</a></span></p>
        </div>

        <div v-if="signupWindow" class="main__form">
            <div class="form">
                <div>
                    <label for="lastName">Nom</label>
                    <input id="lastName" type="text" placeholder="Nom" aria-label="nom">
                </div>

                <div>
                    <label for="firstName">Prénom</label>
                    <input id="firstName" type="text" placeholder="Prénom" aria-label="prénom">
                </div>

                <div>
                    <label for="user-id">Email</label>
                    <input id="user-id" type="email" placeholder="Email" aria-label="email">
                </div>

                <div>
                    <label for="user-pw">Mot de passe</label>
                    <input id="user-pw" type="password" placeholder="Mot de passe" aria-label="mot de passe">
                </div>

                <div>
                    <label for="user-pw-confirm">Confirmation mot de passe</label>
                    <input id="user-pw-confirm" type="password" placeholder="Mot de passe" aria-label="confirmation mot de passe">
                </div>
            </div>
            
            <button @click="signup()" class="form__btn">S'inscrire</button>

            <p>Déjà inscrit? <span><a href="#" @click="loginWindow = true; signupWindow = false">Se connecter</a></span></p>
        </div>
    </main>

    <PageFooter/>

</div>
</template>

<script>

import PageFooter from "../components/PageFooter.vue"

export default {
    data() {
        return {
            loginWindow: true,
            signupWindow: false,
            lastName: "",
            firstName: "",
            email: "",
            password: "",
            passwordConfirm: ""
        }
    },
    components: {
        PageFooter
    },
    methods: {
        login: function() {
            this.$router.push("/home")
        },
        signup: function() {
            this.$router.push("/profile")
        }
    }
}
</script>

<style lang="scss">

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: auto;
    min-height: 100px;
    padding: 0 30px;
    background: linear-gradient(to top left, #5dbae9, #122442);

    &__title {
        display: flex;
        align-items: center;
        height: 100px;
    }

    &__logo {
        height: 300%;
    };

    &__btn {
        width: 140px;
        margin: 10px 20px;
        padding: 5px;
        background: linear-gradient(to top left, #fff, #b3daee);
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;
        font-size: 16px;

        &:hover {
            transform: scale(1.1);
        };        
    }
}

.main {
    min-height: 700px;
    padding: 40px 0;
    background: url("../assets/icon.png") no-repeat center fixed ;

    &__form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 350px;
        margin: 0 auto 50px auto;
        padding: 20px 20px;
        background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
        border: 2px solid #122442;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;
        font-size: 18px;
    }

}

.form {
    margin-bottom: 30px;

    &__btn {
        width: 140px;
        margin: 10px 20px;
        padding: 5px;
        background: linear-gradient(to top left, #5dbae9, #122442);
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;
        font-size: 16px;
        color: #fff;

        &:hover {
            transform: scale(1.1);
        };
    };    

    & div {
        display: flex;
        flex-direction: column;

        & input {
            width: 250px;
            margin-top: 5px;
            margin-bottom: 20px;
            padding: 2px;
            font-size: 16px;
        }
    }

    & p {
        margin-top: 20px;
        font-style: italic;
    }
}

</style>