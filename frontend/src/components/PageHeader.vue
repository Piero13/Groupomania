<template>

<header id="header" class="header">
    <h1 class="header__title"><img src="../assets/icon-left-font-monochrome-white.png" alt="Logo Groupomania Blanc" class="header__logo"></h1>
    
    <nav class="header__nav">
        <p><img src="../assets/image_profil_default.jpg" alt="photo de profil"></p>

        <button @click="ownerProfile()" class="header__nav__profile header__btn">
            Mon profil
        </button>

        <button @click="userProfile()" class="header__nav_members header__btn">
            Membres
        </button>

        <button @click="logout()" class="header__nav_logout header__btn">
            Se déconnecter
        </button>
    </nav>
</header>

</template>

<script>
export default {
    name: 'PageHeader',
    methods: {
        ownerProfile : function() {
            this.$router.push("/profile")
        },
        userProfile : function() {
            this.$router.push("/profile/:userId")
        },
        logout : function () {
            this.$router.push("/")
        }
    }
}
</script>

<style lang="scss">

.header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
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
    }

    &__nav {
        display: flex;
        align-items: center;

        & p {
            overflow: hidden;
            width: 50px;
            height: 50px;
            margin: 10px 20px;
            border: 1px solid #122442;
            border-radius: 26px;
        }

        & img {
            width: 100%;
        }
        
    }

    &__btn {
        width: 140px;
        height: 32px;
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

</style>