<template>
<div id="body">
    <!-- Header de la page de connexion -->
    <header id="log-header" class="log-header">
        <h1 class="log-header__title"><img src="../assets/icon-left-font-monochrome-white.png" alt="Logo Groupomania Blanc" class="log-header__logo"></h1>
        <nav class="log-header__nav">
            <button @click="loginWindow = true; signupWindow = false" class="log-header__nav__login header__btn">
                Se connecter
            </button>
            <button @click="loginWindow = false; signupWindow = true" class="log-header__nav_signup header__btn">
                S'inscrire
            </button>
        </nav>
    </header>
    
    <main id="main" class="main">
        <!-- Bloc connexion -->
        <div v-if="loginWindow" class="main__form">
            <form method="post" @submit.prevent="login()">
                <div class="form">
                    <div>
                        <label for="email">Identifiant</label>
                        <input id="email" class="form-input" type="email" name="email" placeholder="Email" v-model="email" aria-label="email" required>
                    </div>

                    <div>
                        <label for="password">Mot de passe</label>
                        <input id="password" class="form-input" type="password" name="password" placeholder="Mot de passe" v-model="password" aria-label="mot de passe" required>
                    </div>

                    <p class="signup-error" v-if="this.$store.state.errorMsg != null">{{ this.$store.state.errorMsg }}</p>
                </div>
            
                <button type="submit" class="form__btn">Se connecter</button>
            </form>

            <p>Pas encore inscrit? <span><a href="#" @click="loginWindow = false; signupWindow = true">S'inscrire</a></span></p>
        </div>

        <!-- Bloc inscription -->
        <div v-if="signupWindow" class="main__form">
            <form method="post" @submit.prevent="signup()">
                <div class="form">
                    <div>
                        <label for="lastname">Nom</label>
                        <input id="lastname" class="form-input" type="text" name="lastname" placeholder="Nom" v-model="lastname" aria-label="nom" required>
                    </div>

                    <div>
                        <label for="firstname">Prénom</label>
                        <input id="firstname" class="form-input" type="text" name="firstname" placeholder="Prénom" v-model="firstname" aria-label="prénom" required>
                    </div>

                    <div>
                        <label for="email">Email</label>
                        <input id="email" class="form-input" type="email" name="email" placeholder="Email" v-model="email" aria-label="email" required>
                    </div>

                    <div>
                        <label for="password" id="pwLabel">Mot de passe</label>
                        <input id="password" class="form-input" type="password" name="password" placeholder="Mot de passe" v-model="password" aria-label="mot de passe" required>
                    </div>

                    <div>
                        <label for="passwordConfirm" id="pwConfirmLabel">Confirmation mot de passe</label>
                        <input id="passwordConfirm" class="form-input" type="password" name="passwordConfirm" placeholder="Mot de passe" v-model="passwordConfirm" aria-label="confirmation mot de passe" required>
                    </div>

                    <p class="signup-error" v-if="this.$store.state.errorMsg != null">{{ this.$store.state.errorMsg }}</p>
                </div>
            
                <button type="submit" class="form__btn">S'inscrire</button>
            </form>

            <p>Déjà inscrit? <span><a href="#" @click="loginWindow = true; signupWindow = false">Se connecter</a></span></p>
        </div>
    </main>

    <PageFooter/>

</div>
</template>

<script>

import axios from "axios"
import PageFooter from "../components/PageFooter.vue"

export default {
    data() {
        return {
            loginWindow: true,
            signupWindow: false,
            validPassword : false,
            lastname: null,
            firstname: null,
            email: null,
            password: null,
            passwordConfirm: null
        }
    },

    components: {
        PageFooter
    },

    methods: {
        // Fonction connexion
        login() {
            axios.post('/users/login', {
                email: this.email,
                password: this.password
            })
            .then((res) => {
                localStorage.setItem("user", res.data.userId);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("selectedUser", res.data.userId)
                this.$store.dispatch("getUserId", res.data.userId);
                this.email = this.password = null;
                this.$router.push("/home")
            })
            .catch(() => {
                this.password = null;
                this.$store.state.errorMsg = "Email ou mot de passe incorrect !"
            })
        },

        // Fonction inscription
        signup() {
            let pwConfirmationLabel = document.getElementById("pwConfirmLabel");
            let pwConfirmationInput = document.getElementById('passwordConfirm');
            let pwInput = document.getElementById('password');
            
            // On vérifie la correspondance entre le mot de passe et sa confirmation
            // S'il ne sont pas identiques, un message d'erreur est renvoyé
            if(pwConfirmationInput.value && pwInput.value && pwInput.value != pwConfirmationInput.value) {
                pwConfirmationLabel.style.color = 'red';
                pwConfirmationInput.focus();
                this.$store.state.errorMsg = "Formulaire invalide";
                return

            // S'il sont identiques le nouvel utilisateur est enregistré
            // Sa page de profil est affiché
            } else {
                pwConfirmationLabel.style.color = 'initial';
                
                axios.post('/users/signup', {
                    lastname: this.lastname,
                    firstname: this.firstname,
                    email: this.email,
                    password: this.password
                })
                .then(() => {
                    this.login();
                })
                .catch(() => {
                    this.$store.state.errorMsg
                });
            }
        }
    }
}
</script>

<style lang="scss">

.log-header {
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
}

.header {
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
        width: 400px;
        margin: 0 auto 50px auto;
        padding: 20px 20px;
        background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
        border: 2px solid #122442;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;
        font-size: 18px;

        & form {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
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

    & .signup-error {
        text-align: center;
    }
}

// Responsive mobile
@media screen and (max-width: 768px) {
    a, p, label {
        font-size: 14px;
    }

    #body {
        min-width: 380px;
    }

    #log-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 180px;
        padding: 0 0 20px 0;

        & button {
            font-size: 14px;
        }
    }

    .main {
        min-height: 600px;
        background-size: contain;
        &__form {
            width: 100%;

            & .form-input, .form__btn {
                font-size: 14px;
            }
        }
    }
    
}

</style>