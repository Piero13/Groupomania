<template>
    <footer id="footer" class="footer">
        <p>@Groupomania</p>
    </footer>
</template>

<script>
export default {
    name: 'PageFooter'
}
</script>

<style lang="scss">

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background: linear-gradient(to top left, #5dbae9, #122442);

    & p {
        font-size: 24px;
        color: #fff;
    }
}

</style>