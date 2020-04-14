<template>
  <div class="team">
    <slot name="default"></slot>
    <div class="team-members">
      <section v-for="(team, key) in teams" :key="key" :class="key">
        <div class="section-title">{{ team.name }}</div>
        <div v-for="(member, id) in team.members" :key="id" class="member">
          <div class="personal">
            <div class="avatar" :style="getAvatar(member.name)"></div>
            <div class="name">{{ member.name.toUpperCase() }}</div>
          </div>
          <div class="about">{{ member.about }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-multi-str */
export default {
  data() {
    return {
      teams: {
        frontend: {
          name: 'FRONT END',
          members: [
            {
              name: 'Cora',
              about: 'Third-year Computing student living in Glasgow. \
                      Her academic interests include mathematics, ui/ux design and data science. \
                      Interests outside university are health, cooking, exercising and dancing.',
            },
            {
              name: 'Daniela',
              about: 'Third-year Computing science student living in Glasgow. She has worked for a year as a data administrator \
                      and an associate software developer at Frog Systems. She enjoys science, problem solving and learning new things. \
                      Her interests include also hiking, cycling and tennis.',
            },
          ],
        },
        backend: {
          name: 'BACK END',
          members: [
            {
              name: 'Andrew',
              about: 'Third-year Scottish computing student living in Paisley. \
                      He has interests including: fitness in the gym, running, electronics and generalised computing.',
            },
            {
              name: 'Ryan',
              about: 'Third-year Scottish Computing student originally from Aberdeenshire and now living in Paisley. \
                      He has worked for a year as a safety steward for G4S and is currently The Senate of the GCU D&D society. \
                      He has interest in board games, writing and generalised computing.',
            },
          ],
        },
        docs: {
          name: 'DOCUMENTATION',
          members: [
            {
              name: 'James',
              about: 'Third-year Computing student commuting to Glasgow with an interest in computing science.',
            },
            {
              name: 'Euan',
              about: 'Third-year Scottish computing student who is currently living between Glasgow for University \
                      and Girvan for work during holidays. He has worked for three years as a casual waiter for the 1906 restaurant \
                      in the five-star hotel known as Trump Turnberry. He also has other experience in other companies such as TK Maxx. \
                      In his spare time, he enjoys learning and writing music using several instruments including the guitar, \
                      ukulele, keyboard and cajun. Furthermore, he is interested in teaching individuals \
                      and thus admiring to become a secondary teacher that teaches computing-related studies and musical instruments. ',
            },
          ],
        },
      },
    };
  },
  methods: {
    getAvatar(name) {
      try {
        const avatar = require(`@/assets/images/avatars/${name.toLowerCase()}.jpg`); // eslint-disable-line
        return { background: `url(${avatar}) no-repeat center center / cover` };
      } catch (e) {
        const avatar = require('@/assets/images/panel-bg.jpg'); // eslint-disable-line
        return { background: `url(${avatar}) no-repeat center center / 400%` };
      }
    },
  },
};
</script>

<style lang="scss">
.team {
  flex: 1;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "header header"
                       "members members";
  .team-members {
    position: relative;
    display: grid;
    align-content: center;
    padding: 20px 50px;
    @media (min-width: 1100px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      grid-column-gap: 40px;
      grid-template-areas: "frontend backend"
                           "docs docs";
    }
    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      grid-template-areas: "frontend"
                           "backend"
                           "docs";
    }
    section {
      position: relative;
      display: flex;
      flex-direction: column;
      margin: 40px 0;
      .section-title {
        position: relative;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid $color-text;
        font-size: 20px;
        font-weight: 700;
        color: lighten($color-text, 10%);
      }
      .member {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
        .personal {
          display: flex;
          flex-direction: column;
          align-items: center;
          .avatar {
            height: 96px;
            width: 96px;
            border-radius: 50%;
            border: 2px solid $map-fill-color;
          }
          .name {
            margin-top: 10px;
            font-weight: 700;
          }
        }
        .about {
          flex: 1;
          margin: 0 30px 30px 30px;
          color: lighten($color-text, 10%);
          font-weight: 600;
          text-align: justify;
        }
      }
      &.frontend, &.backend { flex: 50%; }
      &.frontend { grid-area: frontend; }
      &.backend { grid-area: backend; }
      &.docs {
        grid-area: docs;
        flex-flow: row wrap;
        .section-title { flex: 100%; }
        .member {
          flex: 50%;
          flex-flow: row wrap;
          min-width: 500px;
        }
      }
    }
  }
}
</style>
