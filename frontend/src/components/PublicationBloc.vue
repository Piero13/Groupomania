<template>
    <section>
        <article class="publication" >
            <!-- Image de la publication -->
            <div class="publication__image" v-if="publication.imageUrl">
                <img :src="publication.imageUrl" alt="image de démo">
            </div>

            <!-- Détails et infos sur la publication -->
            <div class="publication__owner">

                <!-- Infos utilisateur & likes/dislikes -->
                <div class="po__infos">
                    <div class="po__infos__profile">
                        <p class="po__infos__image"><img :src="publication.User.imageUrl" alt="photo de profil"></p>
                        <p>{{ publication.User.firstname }} {{ publication.User.lastname }}</p>
                    </div>

                    <LikeBloc :publication="publication"/>
                </div>

                <!-- Infos publication & bouton suppresson -->
                <div class="po__publication">
                    <p class="po__publication__text"> {{ publication.content }}</p>
                    
                    <button class="delete-btn delete-publication" v-if="this.$store.state.connectedUser != null && (publication.userId == this.$store.state.userId || this.$store.state.connectedUser.isAdmin == true)" @click="deletePublication(publication.id)" title="Supprimer la publication"><i class="far fa-trash-alt"></i></button>
                </div>
            </div>

            <!-- Ajout & affichage des commentaires -->
            <div class="publication__comments">
                <!-- Champ pou rajout de commentaires -->
                <div class="publication__comments__new">
                    <form @submit.prevent="createComment(publication.id)">
                        <textarea type="text" class="new__comment__input" placeholder="Commenter..." v-model="commentContent" aria-label="Commenter la publication" required></textarea>
                        <button type="submit" title="Publier le commentaire"><i class="fas fa-paper-plane"></i></button>
                    </form>
                </div>

                <!-- Affichage des commentaires -->
                <div class="publication__comments__user" v-for="comment in publication.Comments" :key="comment.id">
                    <div class="pcu__infos">
                        <p class="pcu__infos__image"><img :src="comment.User.imageUrl" alt="photo de profil"></p>
                        <p>{{ comment.User.firstname }} {{ comment.User.lastname }}</p>
                        
                        <button class="delete-btn delete-comment" v-if="this.$store.state.connectedUser != null && (comment.userId == this.$store.state.userId || this.$store.state.connectedUser.isAdmin == true)" @click="deleteComment(comment.id)" title="Supprimer le commentaire"><i class="far fa-trash-alt"></i></button>
                    </div>
                    <p>{{ comment.content }}</p>
                </div>
            </div>
        </article>
    </section>
</template>

<script>

import {mapActions, mapGetters} from 'vuex'
import axios from 'axios'
import Swal from 'sweetalert2'
import LikeBloc from "../components/LikeBloc.vue"

export default {
    name: 'PublicationBloc',

    props: {
        publication: Object
    },

    Data() {
        return {
            publications: [],
            commentContent: null
        }
    },

    components: {
        LikeBloc
    },
    
    computed: {
        ...mapGetters(["showPublications"])
    },

    methods: {
        ...mapActions(["getPublications"]),

        // Fonction suppression publication
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

        // Fonction création de commentaire
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

        // Fonction suppression de commentaire
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
                    .then(() => this.getPublications())
                    .catch((error) => console.log(error))
                }
            })
        }
    },

    mounted() {
        this.getPublications();
        this.$store.dispatch("getOneUser");
        this.commentContent = null;
    },
}
</script>

<style lang="scss">
section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.publication {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    width: 60%;
    margin-bottom: 40px;
    background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
    border: 2px solid #122442;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #122442;

    &__image {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 100%;

        & img {
            width: 100%;
        }
    }

    &__owner {
        width: 100%;
        padding: 20px;
    }

    &__comments {
        width: 100%;
        &__new {
            display: flex;
            align-items: center;
            padding: 0 20px;

            & form {
                display: flex;
                width: 100%;
                margin-bottom: 20px;
            }

            & textarea {
                width: 100%;
                height: 100%;
                margin-right: 10px;
            }

            & button {
                background: transparent;
                border: none;
                cursor: pointer;

                &:hover{
                    transform: scale(1.2);
                    color: #1148a8;
                }
            }
        }

        &__user {
            margin: 0 20px 20px 20px;
            padding: 10px;
            border: #12244255 1px solid;
            border-radius: 10px;
        }
    }
}

.po {
    &__infos {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding-bottom: 10px;
    
        &__profile {
            display: flex;
            align-items: center;

            & img {
                width: 100%;
            }

            & p {
                font-size: 18px;
            }
        }

        &__image {
            overflow: hidden;
            width: 40px;
            height: 40px;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 21px;
        }
    }
    
    &__publication {
        display: flex;
        position: relative;
        padding: 5px 0 15px;
        border-bottom: #122442 3px solid;

        &__text {
            margin-right: 20px;
        }
    }
}

.pcu {
    &__infos {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        padding-bottom: 10px;

        &__image {
            overflow: hidden;
            width: 30px;
            height: 30px;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 16px;
        }

        & img {
            width: 100%;
        }
    }
}

.delete-btn {
    background: transparent;
    border: none;
    cursor: pointer;

    &:hover {
        transform: scale(1.2);
    }
}

.delete-comment {
    position: absolute;
    right: 0;
}

.delete-publication {
    position: absolute;
    top: 5px;
    right: 0;
}

// Responsive mobile
@media screen and(max-width: 768px) {
    .publication {
        width: 100%;

        & .po__publication__text {
            padding-right: 20px;
        }

        & i {
            font-size: 18px;
        }

        & textarea {
            font-size: 14px;
        }
    }
}
</style>