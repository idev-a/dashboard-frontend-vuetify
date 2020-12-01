<template>
  <div v-if="cards">
    <v-row v-if="!isUser" class="mx-2 align-center">
      <v-col class="col-auto">
        <v-autocomplete
          v-model="selectedCompany"
          :loading="loading"
          chips
          deletable-chips
          deletable-chips
          :items="companies"
          :rules="[rules.required]"
          label="Select a company"
          required
        />
      </v-col>

      <v-tooltip  bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-badge
            overlap
            color="red lighten-1"
            :content="`${removedCards.length || 0}`"
            offset-x="20"
            offset-y="15"
            class="ml-auto"
          >
            <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading || removedCards.length < 1" @click="trashMenu=!trashMenu" icon color="main"><v-icon size="24" dark>{{ trashMenu ? 'mdi-delete-empty' : 'mdi-trash-can-outline' }}</v-icon></v-btn>
          </v-badge>
        </template>
        <span>Removed Cards</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" @click="saveConfig" icon color="main"><v-icon  size="24"  dark>mdi-database</v-icon></v-btn>
        </template>
        <span>Save Config</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" @click="resetConfig" class="mr-2" icon color="main"><v-icon  size="24"  dark>mdi-refresh</v-icon></v-btn>
        </template>
        <span>Reset Config</span>
      </v-tooltip>
      <v-switch
        v-model="movable"
        :loading="loading"
        class="mr-4"
        :label="labelSwitchMode"
      ></v-switch>
    </v-row>
    <div class="card-scene">
      <Container
        orientation="vertical"
        @drop="onColumnDrop($event)"
        drag-handle-selector=".column-drag-handle"
        :drop-placeholder="upperDropPlaceholderOptions"
      >
        <div v-if="removedCards.length && trashMenu" style="width: : 80vh; overflow-x: auto">
          <div>Deleted Cards</div>
          <Draggable>
          <Container
            :class="['removed-list']"
            orientation="horizontal"
            group-name="col"
            @drop="onTrashDrop($event)"
            :get-child-payload="getRemovedCardPayload"
            :drag-class="cardGhostClass"
            :drop-class="cardGhostDropClass"
            :drop-placeholder="dropPlaceholderOptions"
          >
            <Draggable v-for="card in removedCards" :key="card.id">
              <div :class="card">
                <Atomic :loading="loading" :data="card" :movable="movable"/>
              </div>
            </Draggable>
          </Container>
        </Draggable>
        </div>
        <Draggable v-for="(column, columnIdx) in cards.children" :key="column.id">
          <div :class="columnClass(column.props.className)">
            <div v-if="movable" class="card-column-header">
              <span class="column-drag-handle">&#x2630;</span>
            </div>
            <Container
              v-show="movable"
              orientation="horizontal"
              :class="['horizontal-list']"
              group-name="col"
              @drop="(e) => onCardDrop(column.id, e)"
              :get-child-payload="getCardPayload(column.id)"
              :drag-class="cardGhostClass"
              :drop-class="cardGhostDropClass"
              :drop-placeholder="dropPlaceholderOptions"
            >
              <Draggable v-for="(card, cardIdx) in column.children" :key="card.id">
                <div :class="card">
                  <Atomic 
                    :loading="loading" 
                    :data="card" 
                    :movable="movable" 
                    :columnIdx="columnIdx"
                    :cardIdx="cardIdx"
                    @update="updateCards(columnIdx, cardIdx)"
                  />
                </div>
              </Draggable>
            </Container>
            <Container
              v-show="!movable"
              orientation="horizontal"
              drag-class="card-ghost"
              drop-class="card-ghost-drop"
              lock-axis="[x, y]"
            >
              <Draggable v-for="card in column.children" :key="card.id">
                <div :class="card">
                  <Atomic :loading="loading" :data="card" :movable="movable"/>
                </div>
              </Draggable>
            </Container>
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import Atomic from '../component/Atomic.vue'
import { StatsMixin } from './StatsMixin.js'

export default {
  name: 'Stats',
  components: {
    Container,
    Draggable,
    Atomic
  },

  mixins: [StatsMixin],
}
</script>

<style>
  .draggable-item {
    line-height: 150px;
    text-align: center;
    display: block;
    background-color: #fff;
    outline: 0;
    border: 1px solid rgba(0, 0, 0, .125);
    margin-bottom: 2px;
    margin-top: 2px;
    cursor: default;
    user-select: none;
}

.draggable-item-horizontal {
    padding: 10px;
    line-height: 100px;
    text-align: center;
    /* width : 200px; */
    display: block;
    background-color: #fff;
    outline: 0;
    border: 1px solid rgba(0, 0, 0, .125);
    margin-right: 4px;
    cursor: default;
}

.dragging {
  background-color: yellow;
}

.card-scene {
    padding: 10px;
    /* background-color: #fff; */
}

.card-container {
  /*width: 300px;*/
  min-height: 150px;
  padding: 10px;
}

.card {
    margin: 1px;
    /* border: 1px solid #ccc; */
    background-color: white;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
    padding: 10px;
}

.card-column-header {
    font-size: 18px;
}

.column-drag-handle {
    cursor: move;
    padding: 5px;
}

.card-ghost {
  transition: transform 0.18s ease;
}

.rotate-z {
  transform: rotateZ(5deg)
}

.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
}

.rotate-z-zero {
  transform: rotateZ(0deg)
}

.opacity-ghost {
    transition: all .18s ease;
    opacity: 0.8;
    /* transform: rotateZ(5deg); */
    background-color: cornflowerblue;
    box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
}

.opacity-ghost-drop {
    opacity: 1;
    /* transform: rotateZ(0deg); */
    background-color: white;
    box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.0);
}

.drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 0;
}

.cards-drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px 45px 5px 5px;
}

.bg-gray {
  background-color: #f3f3f3;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  margin: 5px;
}

.smooth-dnd-container.horizontal {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  margin-right: -12px;
  margin-left: -12px;
}

.horizontal-list .smooth-dnd-draggable-wrapper {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%;
}

.removed-list {
  flex-wrap: nowrap !important;
}

@media (min-width: 600px) {
  .smooth-dnd-container.horizontal .smooth-dnd-draggable-wrapper {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 1264px) {
  .smooth-dnd-container.horizontal .smooth-dnd-draggable-wrapper {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 25%;
      flex: 0 0 25%;
      max-width: 25%;
  }
}



</style>