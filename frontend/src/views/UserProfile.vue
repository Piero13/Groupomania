<template>

<div>
    <PageHeader/>

    <main id="main" class="main main-members">
    
    <div class="members">
        <aside class="search">
            <button @click="returnHome()" class="close-btn" title="Fermer la fenêtre de recherche">X</button>

            <div class="search__members">
                <label for="search__members__input">Rechercher des membres</label>

                <div class="search__input">
                    <input type="search" v-model="searchInput" name="search" id="search__members__input" class="search__members__input" aria-label="rechercher des membres" placeholder="Recherche..." @input="searchUsers()" autofocus>
                </div>
            </div>

            <div class="search__results">
                <div v-for="user in searchResults" :key="user.id">
                    <p class="search__results__image"><img :src="user.imageUrl" alt="image de profil du membre"></p>

                    <a href="#" @click="isUserSelected = true, this.selectedUser = user, showUserPublications(user.id)">{{ user.lastname }} {{ user.firstname }}</a>
                </div>
            </div>
        </aside>

        <section class="member">
            <div class="member__profile" v-if="isUserSelected">
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
                            <p><i class="far fa-thumbs-up like" @click="likePublication(publication.id, 1)" title="J'aime"></i>{{ publication.likes }}</p>  
                            <p><i class="far fa-thumbs-down dislike" @click="likePublication(publication.id, -1)" title="Je n'aime pas"></i>{{ publication.dislikes }}</p>
                        </div>
                    </div>

                    <div class="po__post">
                        <p class="po__post__text"> {{ publication.content }}</p><button class="delete-btn delete-publication" v-if="this.$store.state.connectedUser != null && (publication.userId == this.$store.state.userId || this.$store.state.connectedUser.isAdmin == true)" @click="deletePublication(publication.id)" title="Supprimer la publication"><i class="far fa-trash-alt"></i></button>
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
import {mapState, mapActions} from 'vuex';
// import PublicationBloc from "../components/PublicationBloc.vue"

export default {
    data() {
        return {
            searchResults: [],
            searchInput: "",
            isUserSelected: false,
            selectedUser: null,
            selectedUserPublications: null
        }
    },

    components: {
        PageHeader,
        PageFooter,
        // PublicationBloc
    },

    computed: {
        ...mapState({
            users: ["users"],
            publications: ["publications"]
        })
    },

    methods: {
        ...mapActions(["getUsers" , "getPublications"]),

        returnHome() {
            this.$router.push("/home")
        },

        searchUsers() {
            const element = this.searchInput
            const searchResult = this.users.filter(user => user.lastname.toLowerCase().includes(element) || user.firstname.toLowerCase().includes(element))

            return this.searchResults = searchResult
        },

        showUserPublications(idUser) {
            const userId = idUser
            const searchResult = this.publications.filter(publication => publication.userId.toString().includes(userId))
            console.log(searchResult)
            return this.selectedUserPublications = searchResult
        },

        likePublication(publicationId, likeValue) {
            axios.post("/publications/like", {
                publicationId: publicationId,
                userId: parseInt(this.$store.state.userId),
                likeValue: likeValue
            })
                .then(() => {
                    this.getPublications();
                    window.location.reload();
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
                    this.$store.dispatch("getPublications");
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
                    .then(() => {this.$store.dispatch("getPublications")})
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

    mounted() {
        this.getUsers();
        this.getPublications();
        this.$store.dispatch("getOneUser");
        this.searchUsers();
        console.log(this.$store.state.users);
        console.log(this.$store.state.publications)
    }
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
    padding: 10px 60px;
}

.search {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    height: fit-content;
    margin-right: 100px;
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
    width: 100%;

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
    }
}

// Responsive tablet
@media screen and(max-width: 992px) {
    .members {
        padding: 0;
    }

    .search {
        margin-right: 40px;
    }

    .member {
        & .mpi {
            &__firstname, &__lastname {
            font-size: 20px;
            }

            &__description {
                font-size: 16px;
            }
        }

        & .po {
            &__post {
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
                max-height: 120px;
                overflow: scroll;
            }
        }

        & .member {
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