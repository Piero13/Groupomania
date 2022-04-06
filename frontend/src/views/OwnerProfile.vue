<template>

<div>
    <PageHeader/>

    <main id="main" class="main main-ownerProfile">
        <div class="profile">
            <div class="profile__image">
                <img :src="userProfile.imageUrl" alt="Photo de profil">
            </div>

            <div class="profile__modif">
                <button @click="showModifPassword = true" class="form__btn profile__btn">Modifier Mot de passe</button>
            </div>

            
            <div class="profile__infos">
                <form @submit.prevent="updateUser()">
                    <!-- Informations utilisateur -->
                    <div class="pi__user">
                        <input type="text" placeholder="Nom" v-model="lastname" aria-label="Nom" class="pi__user__lastname" required>

                        <input type="text" placeholder="Prénom" v-model="firstname" aria-label="Prénom" class="pi__user__firstname" required>

                        <textarea type="text" placeholder="Description" v-model="description" aria-label="Description" class="pi__user__description"></textarea>
                    </div>

                    <!-- Modification de l'image -->
                    <div class="pi__image">
                        <label for="modify-image"> Modifier l'image</label>
                        <input type="file" name="modify-image" id="modify-image" accept=".png, .jpg, .jpeg" aria-label="Modifier l'image de profil" @change="updateImage"/>
                    </div>

                    <!-- Modification du mot de passe -->
                    <div v-if="showModifPassword" class="pi__password">
                        <button @click="showModifPassword = false" class="close-btn">X</button>

                        <label for="pi__password__old">Ancien mot de passe</label>
                        <input type="password" placeholder="Ancien mot de passe" v-model="oldPassword" id="pi__password__old" required>

                        <label for="pi__password__new">Nouveau mot de passe</label>
                        <input type="password" placeholder="Nouveau mot de passe" v-model="newPassword" id="pi__password__new" required>

                        <label for="pi__password__confirm" id="passwordConfirmLabel">Confirmer mot de passe</label>
                        <input type="password" placeholder="Confirmer mot de passe" v-model="confirmPassword" id="pi__password__confirm" required>
                    </div>

                    <div class="pi__save">
                        <button type="submit" class="form__btn profile__btn">Enregistrer</button>
                    </div>
                </form>
            </div>

            <!-- Boutons retour page d'accueil & suppression du compte utilisateur -->
            <div class="profile__close">
                <button @click="returnHome()" class="close-btn" title="Fermer la fenêtre profil">X</button>
                <button @click="deleteUser()" class="delete-btn delete-user" v-if="this.$store.state.connectedUser != null && (this.$store.state.connectedUser.id == this.$store.state.userId || this.$store.state.connectedUser.isAdmin == true)" title="Supprimer le compte utilisateur"><i class="far fa-trash-alt"></i></button>
            </div>
        </div>
    </main>

    <PageFooter/>
</div>

</template>

<script>

import PageHeader from "../components/PageHeader.vue";
import PageFooter from "../components/PageFooter.vue";
import router from '../router'
import axios from 'axios';
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            showModifPassword: false,
            oldPassword: null,
            newPassword: null,
            confirmPassword: null,
            userProfile: [],
            lastname: null,
            firstname: null,
            description: ""
        }
    },

    components: {
        PageHeader,
        PageFooter
    },  

    methods: {
        returnHome() {
            this.$router.push("/home")
        },

        // Fonction modification image de profil
        updateImage() {
            let filename = document.querySelector('#modify-image').files[0];
            const formData = new FormData();
            formData.append("userId", this.$store.state.userId);
            formData.append("image", filename);

            axios.put("/users/image", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            })
                .then(() => {
                    console.log(formData);
                    location.reload();
                })
                .catch((error => {
                    console.log(error)
                }))
        },

        // Fonction modification compte utilisateur
        updateUser() {
            const formData = new FormData();

            // Modification du mot de passe utilisateur
            if(this.showModifPassword) {
                let passwordConfirmLabel = document.getElementById("passwordConfirmLabel");
                    
                if(this.newPassword != this.confirmPassword) {
                    passwordConfirmLabel.style.color = 'red';
                    return
                } else {
                    formData.append("oldPassword", this.oldPassword);
                    formData.append("newPassword", this.newPassword);
                }
            }
            
            // Modification des information utilisateur
            formData.append("userId", this.userProfile.id);
            formData.append("lastname", this.lastname);
            formData.append("firstname", this.firstname);

            // Modification de la description utilisateur
            if(this.description != null) {
                formData.append("description", this.description);
            }
            
            console.log(formData);

            // Envoi de la requête modification
            axios.put("/users/", formData)
                .then(() => {
                    location.reload();
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // Fonction suppression compte utilisateur
        deleteUser() {
            Swal.fire({
                title: "Confirmer la suppression de votre compte ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                confirmButtonColor: "#32c068",
                cancelButtonText: "Non",
                cancelButtonColor: "#e24b43",
            }).then((response) => {
                if (response.isConfirmed) {
                axios.delete("/users/" + this.$store.state.userId)
                .then(() => {
                    Swal.fire({
                        title: "Votre compte a bien été supprimé",
                        icon: "success",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#32c068",
                    })
                    // On réinitialise le store et on le déconnecte
                    let state = this.$store.state;
                    let initialState = {};
                    Object.keys(state).forEach((key) => {
                        initialState[key] = null;
                    });
                    this.$store.replaceState(initialState);
                    localStorage.clear();
                    router.push("/");
                })
                .catch((error) => {
                    console.log(error);
                });
                }
            });
        },
    },

    mounted() {
        axios.get('/users/' + this.$store.state.userId)
        .then(res => {
            this.userProfile = res.data;
            this.lastname = this.userProfile.lastname;
            this.firstname = this.userProfile.firstname;
            this.description = this.userProfile.description;
        })
        .catch((err) => {
            console.log(err)
        });

        this.$store.dispatch("getOneUser");
    }
}
</script>

<style lang="scss">

.profile {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin-bottom: 40px;
    padding: 20px;
    background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
    border: 2px solid #122442;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #122442;

    &__image {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 30%;
        height: max-content;
        border: 2px solid #122442;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;

        & img {
            width: 100%;
        }
    }

    &__modif {
        display: flex;
        flex-direction: column;
        margin: 0 20px;

        & button {
            margin-top: 0;
        }
    }

    &__infos {
        display: flex;
        flex-direction: column;
        width: 50%;

        & input {
            margin-bottom: 20px;
        }

        & .pi {
            &__user {
                display: flex;
                flex-direction: column;

                &__description {
                    height: 71px;
                    margin-bottom: 20px;
                    border-width: 2px;
                    border-style: inset;
                    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
                }
            }

            &__image {
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 2px inset grey;
                margin-bottom: 20px;
                padding: 5px;
                border-radius: 10px;
                background-color: white;

                & label {
                    font-style: normal;
                }

                & input {
                    margin: 5px 0;
                    padding: 0;
                    border-radius: 0;
                }
            }

            &__password {
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;
                padding: 10px;
                border: #12244255 1px solid;
                border-radius: 10px;

                & button {
                    align-self: flex-end;
                }
            }

            &__save {
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;

                & button {
                    margin: 0;
                }
            }
        }
    }

    &__close {
        display: flex;
        flex-direction: column;
        align-items: center;

        & .delete-btn {
            margin: 20px 0 0 20px;
        }
    }
}

.close-btn {
    margin-left: 20px;
    width: 20px;
    height: 20px;
    background: linear-gradient(to top left, #5dbae9, #122442);
    color: #fff;

    &:hover {
        transform: scale(1.2);
    }
}

//responsive tablet
@media screen and(max-width: 992px) {
    .profile {
        flex-direction: column;
        align-items: center;
        position: relative;

        &__image {
            margin-bottom: 20px;
        }

        &__btn {
            margin-bottom: 20px;
        }

        &__infos {
            width: 70%;
        }

        &__close {
            position: absolute;
            top: 20px;
            right: 20px;
        }
    }
}

// responsive mobile
@media screen and(max-width: 768px) {
    .main {
        min-width: 380px;
        padding: 0;
    }
    .profile {
        width: 100%;
        margin-bottom: 40px;

        &__image {
            width: 60%;
        }

        & button, input, textarea {
            font-size: 14px;
        }

        &__infos {
            width: 100%;
        }

        & .pi__save {
            justify-content: center;
        }
    }
}
</style>