<template>
    <section>
        <article class="publication" v-for="publication in this.publications" :key="publication.id">
            <div class="publication__image" v-if="publication.imageUrl">
                <img :src="publication.imageUrl" alt="image de démo">
                <button class="delete-btn delete-publication" v-if="this.$store.state.connectedUser != null && (publication.userId == this.$store.state.userId || this.$store.state.connectedUser.admin == true)"><i class="far fa-trash-alt"></i></button>
            </div>

            <div class="publication__owner">
                <div class="po__infos">
                    <div class="po__infos__profile">
                        <p class="po__infos__image"><img :src="publication.User.imageUrl" alt="photo de profil"></p>
                        <a href="#">{{ publication.User.firstname }} {{ publication.User.lastname }}</a>
                    </div>

                    <div class="po__infos__likes">
                        <p><i class="far fa-thumbs-up like" @click="likePublication(publication.id, 1)"></i>{{ publication.likes }}</p>  
                        <p><i class="far fa-thumbs-down dislike" @click="likePublication(publication.id, -1)"></i>{{ publication.dislikes }}</p>
                    </div>
                </div>

                <div class="po__post">
                    <p class="po__post__text"> {{ publication.content }}</p>
                </div>
            </div>

            <div class="publication__comments">
                <div class="publication__comments__new">
                    <form @submit.prevent="createComment(publication.id)">
                        <textarea type="text" id="new__comment__input" placeholder="Commenter..." v-model="commentContent" aria-label="Commenter la publication" required></textarea>
                        <button type="submit"><i class="fas fa-paper-plane"></i></button>
                    </form>
                </div>

                <div class="publication__comments__user" v-for="comment in publication.Comments" :key="comment.id">
                    <div class="pcu__infos">
                        <p class="pcu__infos__image"><img :src="comment.User.imageUrl" alt="photo de profil"></p>
                        <a href="#">{{ comment.User.firstname }} {{ comment.User.lastname }}</a>
                        <button class="delete-btn delete-comment" v-if="this.$store.state.connectedUser != null && (comment.userId == this.$store.state.userId || this.$store.state.connectedUser.admin == true)"><i class="far fa-trash-alt"></i></button>
                    </div>
                    <p>{{ comment.content}}</p>
                </div>
            </div>
        </article>
    </section>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import axios from 'axios'

export default {
    name: 'PublicationBloc',

    Data() {
        return {
            publications: [],
            comments: [],
            commentContent: null
        }
    },
    
    computed: {
        ...mapState({
            publications: ["publications"]
        })
    },

    methods: {
        ...mapActions(["getPublications"]),

        likePublication(publicationId, likeValue) {
            axios.post("/publications/like", {
                publicationId: publicationId,
                userId: parseInt(this.$store.state.userId),
                likeValue: likeValue
            })
                .then(() => {
                    this.$store.dispatch("getPublications");
                    location.reload();
                })
                .catch((error) => {
                    console.log(error);
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
        }
    },

    mounted() {
        this.getPublications();
        this.$store.dispatch("getOneUser");
        this.commentContent = null;
        console.log(this.publications)
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
        position: relative;
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
            }

            & textarea {
                width: 100%;
                margin: 0 10px 10px 0;
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
            margin: 20px;
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
            width: 30px;
            height: 30px;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 16px;
        }

        &__likes {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80px;
            font-size: 20px;

            & i {
                margin-right: 5px;
                cursor: pointer;
                &:hover {
                    transform: scale(1.2);
                    color: #1148a8;
                }
            }
        }
    }
    
    &__post {
        padding: 5px 0 15px;
        border-bottom: #122442 3px solid;
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
    top: 0;
    right: 0;
    margin: 10px 10px 0 0;

    & i {
        color: #1148a8;
    }
}

</style>