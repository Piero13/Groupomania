<template>

<div>
    <PageHeader/>

    <main id="main" class="main main-members">
    
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
                    <img :src="this.selectedUser.imageUrl" alt="image du profil">
                </div>

                <div class="member__profile__infos">
                    <div class="mpi__name">
                        <p class="mpi__firstname">{{ this.selectedUser.firstname }}</p>

                        <p class="mpi__lastname">{{ this.selectedUser.lastname }}</p>
                    </div>

                    <p class="mpi__description">{{ this.selectedUser.description }}</p>
                </div>

                <button @click="deleteUser()" class="delete-btn delete-user" v-if="this.$store.state.connectedUser != null && (this.$store.state.connectedUser.id == this.selectedUser.id || this.$store.state.connectedUser.isAdmin == true)" title="Supprimer le compte utilisateur"><i class="far fa-trash-alt"></i></button>   
            </div>

            <!-- Affichage des publications utilisateur -->
            <article class="publication" v-for="publication in this.selectedUserPublications" :key="publication.id">
                <div class="publication__image" v-if="publication.imageUrl">
                    <img :src="publication.imageUrl" alt="image de démo">
                </div>

                <div class="publication__owner">
                    <div class="po__infos">
                        <div class="po__infos__profile">
                            <p class="po__infos__image"><img :src="publication.User.imageUrl" alt="photo de profil"></p>
                            <p>{{ publication.User.firstname }} {{ publication.User.lastname }}</p>
                        </div>

                        <div class="po__infos__likes">
                            <form @submit.prevent="likePublication(publication.id, 1)">
                                <button type="submit" title="J'aime" class="like-btn"><i class="far fa-thumbs-up like"></i></button>
                            </form>
                            <p>{{ publication.likes }}</p>

                            <form @submit.prevent="likePublication(publication.id, -1)">
                                <button type="submit" title="J'aime" class="like-btn"><i class="far fa-thumbs-down dislike"></i></button>
                            </form>
                            <p>{{ publication.dislikes }}</p>
                        </div>
                    </div>

                    <div class="po__publication">
                        <p class="po__publication__text"> {{ publication.content }}</p><button class="delete-btn delete-publication" v-if="this.$store.state.connectedUser != null && (publication.userId == this.$store.state.userId || this.$store.state.connectedUser.isAdmin == true)" @click="deletePublication(publication.id)" title="Supprimer la publication"><i class="far fa-trash-alt"></i></button>
                    </div>
                </div>

                <div class="publication__comments">
                    <div class="publication__comments__new">
                        <form @submit.prevent="createComment(publication.id)">
                            <textarea type="text" id="new__comment__input" placeholder="Commenter..." v-model="commentContent" aria-label="Commenter la publication" required></textarea>
                            <button type="submit" title="Publier le commentaire"><i class="fas fa-paper-plane"></i></button>
                        </form>
                    </div>

                    <div class="publication__comments__user" v-for="comment in publication.Comments" :key="comment.id">
                        <div class="pcu__infos">
                            <p class="pcu__infos__image"><img :src="comment.User.imageUrl" alt="photo de profil"></p>
                            <p>{{ comment.User.firstname }} {{ comment.User.lastname }}</p>
                            <button class="delete-btn delete-comment" v-if="this.$store.state.connectedUser != null && (comment.userId == this.$store.state.userId || this.$store.state.connectedUser.isAdmin == true)" @click="deleteComment(comment.id)" title="Supprimer le commentaire"><i class="far fa-trash-alt"></i></button>
                        </div>
                        <p>{{ comment.content}}</p>
                    </div>
                </div>
            </article>
        </section>

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
import Swal from 'sweetalert2';
import {mapActions, mapGetters} from 'vuex';
// import PublicationBloc from "../components/PublicationBloc.vue"

export default {
    data() {
        return {
            searchResults: [],
            searchInput: "",
            isUserSelected: false,
            selectedUser: null,
            selectedUserPublications: null,
            commentContent: null,
            
        }
    },

    components: {
        PageHeader,
        PageFooter,
    },

    computed: {
        ...mapGetters({
            publications: 'showPublications',
            users: 'showUsers'})
    },

    methods: {
        ...mapActions(['getUsers' , 'getPublications']),

        returnHome() {
            this.$router.push("/home")
        },

        searchUsers() {
            const element = this.searchInput;
            this.searchResults = this.users.filter(user => user.lastname.toLowerCase().includes(element) || user.firstname.toLowerCase().includes(element));
            
            return 
        },

        selectUser(user) {
            this.isUserSelected = true;
            this.selectedUser = user;
            localStorage.setItem("selectedUser", user.id)
            this.showUserPublications(user.id)
        },

        showUserPublications(idUser) {
            const userId = idUser;
            this.selectedUserPublications = this.publications.filter(publication => publication.userId.toString().includes(userId));

            return
        },

        likePublication(publicationId, likeValue) {
            axios.post("/publications/like", {
                publicationId: publicationId,
                userId: parseInt(this.$store.state.userId),
                likeValue: likeValue
            })
                .then(() => {
                    this.getPublications();
                    console.log(this.$store.state.publications)
                })
                .catch((error) => {
                    console.log(error);
                })
        },

        deletePublication(publicationId) {
            Swal.fire({
                title: "Confirmer la suppression de la publication ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                confirmButtonColor: "#32c068",
                cancelButtonText: "Non",
                cancelButtonColor: "#e24b43",
            }).then((response) => {
                if(response.isConfirmed) {
                    axios.delete('/publications/' + publicationId)
                    .then(() => this.getPublications())
                    .catch((error) => console.log(error))
                }
            })
        },

        createComment(publicationId) {
            axios.post("/comments", {
                publicationId: publicationId,
                userId: parseInt(this.$store.state.userId),
                content: this.commentContent
            })
                .then(() => {
                    this.getPublications();
                    this.commentContent = null;
                })
                .catch((error) => {
                    console.log(error);
                })
        },

        deleteComment(commentId) {
            Swal.fire({
                title: "Confirmer la suppression du commentaire ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                confirmButtonColor: "#32c068",
                cancelButtonText: "Non",
                cancelButtonColor: "#e24b43",
            }).then((response) => {
                if(response.isConfirmed) {
                    axios.delete('/comments/' + commentId)
                    .then(() => {this.getPublications()})
                    .catch((error) => console.log(error))
                }
            })
        },

        deleteUser() {
            Swal.fire({
                title: "Confirmer la suppression du compte :",
                text: this.selectedUser.firstname + " " + this.selectedUser.lastname,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                confirmButtonColor: "#32c068",
                cancelButtonText: "Non",
                cancelButtonColor: "#e24b43",
            }).then((response) => {
                if (response.isConfirmed) {
                axios.delete("/users/" + this.selectedUser.id)
                .then(() => {
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

    beforeMount() {
        this.getUsers();
        this.getPublications();
        this.selectedUser = this.users.find(user => user.id == localStorage.getItem("selectedUser"));
        this.selectedUserPublications = this.publications.filter(publication => publication.userId.toString().includes(localStorage.getItem("selectedUser")));
    },

    mounted() {
        this.getUsers();
        this.searchUsers();
        this.getPublications();
        this.$store.dispatch("getOneUser");
        
        
        console.log(this.users);
        console.log(this.publications);
        console.log(this.selectedUser)
    },
}
</script>

<style lang="scss">

.main-members {
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