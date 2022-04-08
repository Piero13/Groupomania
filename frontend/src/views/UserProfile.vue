<template>

<div>
    <PageHeader/>

    <main id="main" class="main">
    
    <div class="members">
        <!-- Recherche d'utilisateurs -->
        <aside class="search">
            <button @click="returnHome()" class="close-btn" title="Fermer la fenêtre de recherche">X</button>

            <!-- Champ de recherche -->
            <div class="search__members">
                <label for="search__members__input">Rechercher des membres</label>

                <div class="search__input">
                    <input type="search" v-model="searchInput" name="search" id="search__members__input" class="search__members__input" aria-label="rechercher des membres" placeholder="Recherche..." @input="searchUsers()">
                </div>
            </div>

            <!-- Résultats de recherche -->
            <div class="search__results">
                <div v-for="user in searchResults" :key="user.id">
                    <p class="search__results__image"><img :src="user.imageUrl" alt="image de profil du membre"></p>

                    <a href="#" @click="selectUser(user)">{{ user.lastname }} {{ user.firstname }}</a>
                </div>
            </div>
        </aside>

        <!-- Affichage profil et publications de l'utilisateur sélectionné -->
        <section class="member">
            <!-- Affichage du profil utilisateur -->
            <div class="member__profile">
                <div class="member__profile__image">
                    <img :src="this.$store.state.selectedUser.imageUrl" alt="image du profil">
                </div>

                <div class="member__profile__infos">
                    <div class="mpi__name">
                        <p class="mpi__firstname">{{ this.$store.state.selectedUser.firstname }}</p>

                        <p class="mpi__lastname">{{ this.$store.state.selectedUser.lastname }}</p>
                    </div>

                    <p class="mpi__description">{{ this.$store.state.selectedUser.description }}</p>
                </div>

                <button @click="deleteUser()" class="delete-btn delete-user" v-if="this.$store.state.connectedUser != null && (this.$store.state.connectedUser.id == this.$store.state.selectedUser.id || this.$store.state.connectedUser.isAdmin == true)" title="Supprimer le compte utilisateur"><i class="far fa-trash-alt"></i></button>   
            </div>

            <!-- Affichage des publications utilisateur -->
            
            <PublicationBloc v-for="publication in showSelectedUserPublications" :key="publication.id" :publication="publication"/>
            
        </section>

    </div>
    </main>

    <PageFooter/>
</div>

</template>

<script>

import axios from 'axios';
import PageHeader from "../components/PageHeader.vue";
import PageFooter from "../components/PageFooter.vue";
import PublicationBloc from "../components/PublicationBloc.vue";
import router from '../router'
import Swal from 'sweetalert2';
import {mapActions, mapGetters} from 'vuex';

export default {
    data() {
        return {
            searchResults: [],
            searchInput: "",
            isUserSelected: false,
        }
    },

    components: {
        PageHeader,
        PageFooter,
        PublicationBloc,
    },

    computed: {
        ...mapGetters(
            [
                'showPublications',
                'showUsers',
                'showSelectedUserPublications',
            ])
    },

    methods: {
        ...mapActions(['getUsers' , 'getPublications', 'findUser', 'findUserPublications']),

        // Fonction retour à la page d'accueil
        returnHome() {
            this.$router.push("/home")
        },

        // Fonction recherche utilisateurs
        searchUsers() {
            const element = this.searchInput;
            this.searchResults = this.showUsers.filter(user => user.lastname.toLowerCase().includes(element) || user.firstname.toLowerCase().includes(element));

            return 
        },

        // Fonction sélection utilisateur
        selectUser(user) {
            this.isUserSelected = true;
            this.$store.state.selectedUser = user;
            localStorage.setItem("selectedUser", user.id)
            this.showUserPublications(user.id)
        },

        // Fonction récupération des publications de l'utilisateur sélectionné
        showUserPublications(idUser) {
            const userId = idUser;
            this.$store.state.selectedUserPublications = this.showPublications.filter(publication => publication.userId.toString().includes(userId));

            return
        },

        // Fonction suppression d'un utilisateur
        deleteUser() {
            Swal.fire({
                title: "Confirmer la suppression du compte :",
                text: this.$store.state.selectedUser.firstname + " " + this.$store.state.selectedUser.lastname,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                confirmButtonColor: "#32c068",
                cancelButtonText: "Non",
                cancelButtonColor: "#e24b43",
            })
            .then((response) => {
                if (response.isConfirmed) {
                axios.delete("/users/" + this.$store.state.selectedUser.id)
                .then(() => {
                    // Si le propriétaire du compte fait la demande
                    if(this.$store.state.selectedUser.id == this.$store.state.connectedUser.id) {
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
                    // Si c'est un compte admin non propriétaire du compte
                    } else {
                        Swal.fire({
                            title: "Le compte de " + this.$store.state.selectedUser.firstname + " " + this.$store.state.selectedUser.lastname + " a bien été supprimé",
                            icon: "success",
                            confirmButtonText: "Retour à la page d'accueil",
                            confirmButtonColor: "#32c068",
                        });
                        localStorage.setItem("selectedUser", this.$store.state.connectedUser.id);
                        router.push("/home");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
                }
            });
        },
    },

    created() {
        this.findUser();
        this.findUserPublications();
    },

    mounted() {
        this.getPublications();
        this.searchUsers();
        this.getUsers();
    },

    beforeUpdate() {
        this.searchUsers();
    },
}
</script>

<style lang="scss">

.main {
    min-width: 380px;
}

.members {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px 40px;
}

.search {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    height: fit-content;
    margin-right: 40px;
    padding: 20px;
    background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
    border: 2px solid #122442;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #122442;

    & .close-btn {
        align-self: flex-end;
        margin: 0 0 20px 0;
    }

    &__members {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 10px;

        & div {
            display: flex;
            align-items: center;
        }

        &__input {
            width: 100%;
        }
    }

    &__input {
        display: flex;
        align-items: center;
        padding-top: 5px;
    }

    &__results {
        display: flex;
        flex-direction: column;
        width: 100%;

        & div {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 10px 0;
        }

        &__image {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            width: 40px;
            height: 40px;
            min-width: 40px;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 20px;

            & img {
                width: 100%;
            }
        }
    }
}

.member {
    display: flex;
    flex-direction: column;
    width: 65%;

    &__profile {
        position: relative;
        display: flex;
        width: 100%;
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
            width: auto;
            max-width: 300px;
            height: max-content;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 10px;

            & img {
                width: 100%;
            }
        }

        &__infos {
            display: flex;
            flex-direction: column;
            width: 100%;

            & .mpi {
                &__name {
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    margin-bottom: 20px;
                }

                &__lastname, &__firstname {
                    margin-right: 10px;
                    font-size: 22px;
                    font-weight: bold;
                }

                &__description {
                    font-size: 18px;
                }
            }

        }

        & .delete-user {
            position: absolute;
            right: 20px;
        }
    }

    & .publication {
        width: 100%;

        & .po__publication{
            position: relative;
        }

        & .delete-publication {
            position: absolute;
            top: 5px;
            right: 0;
        }
    }
}

// Responsive tablet
@media screen and(max-width: 992px) {
    .members {
        padding: 0;
    }

    .search {
        width: 30%;
        margin-right: 40px;
    }

    .member {
        width: 65%;
        & .mpi {
            &__firstname, &__lastname {
            font-size: 20px;
            }

            &__description {
                font-size: 16px;
            }
        }

        & .po {
            &__publication {
                &__text {
                    padding-right: 20px;
                }
            }
        }
    }
}

// Responsive mobile
@media screen and(max-width: 768px) {
    .members {
        flex-direction: column;
        align-items: center;

        & i {
            font-size: 18px;
        }

        & .search {
            width: 100%;
            margin: 0 0 40px 0;

            & .close-btn {
                margin: 0;
            }

            &__members {
                &__input {
                    font-size: 14px;
                }
            }

            &__results {
                max-height: 140px;
                overflow: scroll;
            }
        }

        & .member {
            width: 100%;
            &__profile {
                &__image {
                    max-width: 40%;
                }
            }
        }

        & .mpi {
            &__firstname, &__lastname {
            font-size: 18px;
        }

            &__description {
                font-size: 14px;
            }
        }
    }
}
</style>