
export abstract class Clause {
    /**
     * Turns the clause into a query string.
     * @return {string} Partial query string.
     */
    abstract build(): string;

    /**
     * Turns the clause into a query string.
     * @return {string} Partial query string.
     */
    toString(): string {
        return this.build();
    }

}
