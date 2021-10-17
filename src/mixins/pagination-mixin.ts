import { PaginatedRes, PaginationQuery } from '@/interfaces/api/common'
import { PAGE_SIZE } from '@/utils/constants'
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'

@Component
export class PaginationMixin extends Vue {
  page = 1
  pagination!: PaginatedRes

  get paginationLength (): number {
    return Math.ceil(this.pagination.count / PAGE_SIZE)
  }

  get noPagination (): boolean {
    return this.pagination.next === null && this.pagination.previous === null
  }

  getList (query?: PaginationQuery): void {
    throw Error('You must implement `getList` function when using `PaginationMixin`')
  }

  @Watch('page')
  onPageChange (page: number) {
    this.getList({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE
    })
  }
}
