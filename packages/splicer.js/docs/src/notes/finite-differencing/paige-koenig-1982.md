# Finite Differencing of Computable Expressions

Paige & Koenig, 1982. [ACM Digital Library](https://dl.acm.org/doi/10.1145/357172.357177)

See [research material](../../research/finite-differencing.md#foundational).

Important keywords:

- Program optimization.
- Finite differencing.
- Strength reduction.
- Iterator inversion.
- Formal differentiation.

## Abstract

- The paper frames finite differencing as a "program optimization method" that generalizes strength reduction (replacing expensive operations with cheaper ones).
- Finite differencing also enables efficient implementation of other program transformations, e.g. "iterator inversion."
- The formalization works by composing basic semantics-preserving transformations.

## Introduction

- Paige developed "formal differentiation" as a global program optimization that captures a recurring pattern: replacing repeated costly calculations with inexpensive incremental updates.
- Applied to high-level but inefficient problem statements, the transformed algorithms become more complex but more efficient. The method generalizes Cocke's strength reduction and provides a framework for Earley's "iterator inversion."
- The authors prefer "finite differencing" over "formal differentiation" to place it in proper historical context: a link to 16th-century finite difference techniques invented to reduce labor in calculations.
- Language-independent algorithms to implement finite differencing were devised. Most useful for very high-level languages, so set-theoretic finite differencing was the focus.

What makes finite differencing stand out:

1. Flexible: works at very high-level or low-level language levels.
2. Can quickly converge from high-level inefficient form to a much lower-level efficient implementation.
3. Can be implemented systematically, following a well-known methodology.
4. Can be shown to yield asymptotic speedup, not just hoped-for improvement.

## Historical Perspective

This section walks us through the progression of history that leads to the author's idea.

### Finite differencing as a Mathematical Method

Henry Briggs (16th century) used finite differencing to tabulate polynomial values. The problem was that: given a polynomial \\(p(x)\\), generate an indefinite evenly spaced values \\(p(x_0)\\), \\(p(x_0 + h)\\), \\(p(x_0 + 2h)\\), ... without evaluating the polynomial from scratch each time.

The key observation, if \\(p(x)\\) has degree \\(n\\)), then, define difference polynomials as follows:

- \\(p_0(x) = p(x)\\), which has degree \\(n\\).
- \\(p_1(x) = p_0(x + h) - p_0(x)\\), which has degree \\(n - 1\\).
- ...
- \\(p_n(x) = p\_{n-1}(x+h) - p\_{n-1}(x)\\), which has a degree \\(0\\). In other words, \\(p_n\\) is constant.

Example with \\(p(x) = x^2\\), \\(h = 1\\):

| \\(x\\) | \\(p(x) = x^2\\) | 1st difference | 2nd difference |
| ------- | ---------------- | -------------- | -------------- |
| 0       | 0                |                |                |
| 1       | 1                | 1              |                |
| 2       | 4                | 3              | 2              |
| 3       | 9                | 5              | 2              |
| 4       | 16               | 7              | 2              |
| 5       | 25               | 9              | 2              |

The finite differencing method is as follows:

1. Compute initial values:
   - \\(t(1) = p(x_0)\\).
   - \\(t(2) = p_1(x_0)\\).
   - ...
   - \\(t(n+1) = p_n(x_0)\\).
2. Then iterate repeatedly until all desired values have been computed:

   ```py
   print x, t(1);
   t(1) := t(1) + t(2);
   t(2) := t(2) + t(3);
   ...
   t(n) := t(n) + t(n + 1);
   x := x + h;
   ```

Loop invariant, at iteration \\(i\\):

- \\(t(1) = p(x_i)\\).
- \\(t(2) = p_1(x_i)\\).
- ...
- \\(t(n) = p\_{n-1}(x_i)\\).
- \\(t(n+1) = p_n(x_i)\\).

Note that each loop iteration need not update \\(t(n + 1)\\) as \\(t(n+1)\\) is constant. Therefore, each iteration is just \\(n\\) additions (one per \\(t(1)\\), \\(t(2)\\), ..., \\(t(n)\\)), instead of \\(n\\) additions and \\(n\\) multiplications as in Horner's rule.

Babbage's difference engine was built to automate step 2. Note that step 2 is the same regardless of the exact polynomials, so it can be automated. Digital computers through WWII were designed for the same task: finite differencing for gunnery tables.

> There's something intriguing about the idea that the earliest computers were incremental computation machines.

### Reduction in Operator Strength

John Cocke (1960s) discovered "reduction in operator strength", a program optimization method, that highlighted the impact of finite differencing methods in the speedup of FORTRAN programs.

Before delving into the illustrative example, I researched a few concepts in the area of program optimization. Disclaimer, I don't have an expertise in this area at the time of writing.

- A strongly connected component in a directed graph is a maximal subgraph where every vertex is reachable from every other vertex within that subgraph.
- Code block: A sequence of instructions that has only one entry point and one exit point.
- Program region: Possibly a directed subgraph of code blocks.
- Strongly connected program region: I suppose that strongly connected means as it is in graph theory. This means a maximal subgraph of code block in which starting from one code block, there's a possible path to any other code blocks.

Illustrative example:

- Suppose the following situation:
  1. A strongly connected program region \\(R\\).
  2. An expression \\(i \* c \\) occurs in \\(R\\), in which \\(c\\) is a region constant (supposedly a variable that cannot change within \\(R\\)) and \\(i\\) is defined before every entry to \\(R\\), while \\(i\\) is not.
  3. \\(i \* c\\) cannot be moved out of \\(R\\) because there are redefinitions to \\(i\\).
  4. All redefinitions to \\(i\\) within \\(R\\) are of the form \\(i = i \pm \text{delta}\\), \\(\text{delta}\\) is also a region constant.

- A concrete version of the above situation:

  ```cpp
  const int c = 10; // region constant `c`
  const int delta = 1; // region constant `delta`
  int sum = 0;
  for (int i = 0; i <= 100; i = i + delta) {
    sum += i * c; // expression in question
  }
  ```

- The question: How do we move all calulations of \\(i \* c\\) out of \\(R\\)?

- Idea:
  1. Insert an initial assignment \\(T = i \* c\\), \\(T\\) is a compiler-generated variable, prior to any entry points of \\(R\\).
  2. Before each redefinition \\(i = i \pm \text{delta}\\), we can replace it with a redefinition \\(T \pm \text{delta} \* c\\).
  3. Because \\(\text{delta}\\) and \\(c\\) are region constants, \\(\text{delta} \* c\\) is invariant. Thus, it can be moved out of \\(R\\).
  4. Now replace all uses of \\(i \* c\\) with uses of \\(T\\).

- Impact: All \\(i \* c\\) are replaced with \\(T\\), other operations stay roughly the same, except for the additional initial computations.

Cocke's strength reduction technique is powerful enough that it can transform repeated polynomial calculations according to Horner's rule into one that is essentially Briggs' finite difference method. Note that Cocke's technique doesn't even treat polynomials specially, but manages to converge into a technique esstentially as finite differencing. This shows that inherently, finite differencing works due to properties of elementary operations, not exclusive properties of polynomials (say, the degree observation above).

These properties are the distributive and associative laws for sums and products.

### Extensions

1. Cocke and Schwarts later extended this strength reduction idea (also called as finite differencing by the authors) to all arithmetic operations having appropriate distributive properties.
2. Earley suggest applying finite differencing in a set theoretic context.
3. Fong and Ullman later proved that Earley's method can improve the asymptotic behavior of an algorithm. A theoretical characterization could then be developed to determine when this technique can be applied.
4. Finite differencing was generalized further by Paige to allow its application in many type of expressions with various operations and data types.

## Definitions and Notations

### Language

Finite differencing is language-agnostic, but SETL is used in this paper for illustrative purposes.

SETL seems to allow the programmer to work on many levels of abstractions, ranging from concrete FORTRAN to set-theory level.

Data types in SETL: heterogeneous tuples, sets and maps.

- Tuples: Ordered from first to the last component.
- Sets: Unordered and can only contain unique elements.
- Maps: Sets of pairs \\(([x, y]\\)), each associating a domain value \\(x\\) to a range value \\(y\\).

Primitive operations:

| Primitive operations            | Remarks                                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| \\(x + y\\)                     | Addition for integers/reals. Union for sets. Concatenation for strings and tuples.                  |
| \\(x - y\\)                     | Subtraction for integers/reals. Difference for sets.                                                |
| \\(x \* y\\)                    | Multiplication for integers/reals. Intersection for sets.                                           |
| \\(x \in y\\), \\(x \notin y\\) | Tests membership in a set or tuple.                                                                 |
| \\(\#x\\)                       | Returns the cardinality of a set, or the length of a tuple or string.                               |
| **arb** \\(x\\)                 | Picks an arbitrary element from set \\(x\\). **arb** \\(\\{\\}\\) yields the undefined atom **om**. |
| \\(x\\) **incs** \\(y\\)        | Returns whether set \\(x\\) includes set \\(y\\).                                                   |
| \\(x\\) **with** \\(y\\)        | Equivalent to \\(x + \\{y\\}\\) if \\(x\\) is a set, or \\(x + [y]\\) if \\(x\\) is a tuple.        |
| \\(x\\) **less** \\(y\\)        | Equivalent to \\(x - \\{y\\}\\).                                                                    |
| \\(\\{x, y, \ldots\\}\\)        | Set literal.                                                                                        |
| \\([x, y, \ldots]\\)            | Tuple literal.                                                                                      |

- C-like convention: \\(x := x \text{op} \textit{exp}\\) can be abbreviated as \\(x \text{op}:= \text{exp}\\).

- APL reduction operation: \\(\text{binop}/Q\\), which folds a **binary associative operator** \\(\text{binop}\\) over all elements of a set or tuple \\(Q\\).

- Powerful iterators: Allow constrained search through sets and tuples.
  - Can be combined.
  - Can be used as arguments to various iterative operations.

- The most basic example to illustrate iterators is the **forall loop** (\\(\forall\\)-loop):

  ```
  (∀x ∈ s | x mod 2 = 0)
    block(x)
  end ∀;
  ```

  This executes `block` for each even number in `s`.

  Internal implementation:
  1. Iterate through `s` selecting each value without repetition into the bound variable `x`.
  2. Execute the predicate.
  3. Run the block when it holds.

  If `s` is a set, iteration order is unspecified; if `s` is a tuple, iteration is from first to last component.

- **forall** loops can implement many high-level iterator-involving expressions:
  - **Set former**: Computes a subset satisfying a predicate. For example, \\(\\{x \in s \mid x \bmod 2 \neq 0\\}\\) gives all odd elements of \\(s\\). A variant \\(\\{x^2 : x \in s \mid x \bmod 2 \neq 0\\}\\) gives the set of squares of odd elements.

- **Range specifications**: \\([2 .. n-1]\\) produces a tuple \\([2, 3, \ldots, n-1]\\). \\(\\{1, 3 .. 11\\}\\) produces all odd numbers from 1 to 11.

- **Bounded existential and universal quantifiers**: A universal quantifier \\(\forall j \in [2..n-1] \mid n \bmod j \neq 0\\) tests primality. If it evaluates to false, \\(j\\) is assigned a witness as a side effect.

- **Map retrieval** comes in three forms:
  1. \\(f(a)\\): Function application. Returns **om** if \\(a\\) is not in the domain or \\(f\\) is multivalued at \\(a\\).
  2. \\(f\\{a\\}\\): Image set of \\(\\{a\\}\\) under \\(f\\). Returns \\(\\{\\}\\) if \\(a\\) is not in the domain.
  3. \\(f[S]\\): Image of set \\(S\\) under \\(f\\), equivalent to \\(+/\\{f(a) : a \in S\\}\\).

- **Map modification** via indexed assignment:
  - \\(f(a) := \textbf{om}\\) removes \\(a\\) from the domain.
  - \\(f(a) := z\\) first removes \\(a\\), then adds the pair \\([a, z]\\).
  - \\(f\\{a\\} \mathrel{+}:= \text{delta}\\) modifies the image set at a domain point.

> So map here is like a relation.

- \\(n\\)-parameter maps are sets of pairs whose first component is an \\(n\\)-tuple. Notational shorthand: \\(f(x, y, z)\\) abbreviates \\(f([x, y, z])\\).

- SETL uses **copy value semantics**, as in mathematics.

### Verification

The authors extend SETL with two annotation statements for verification purposes:

- **assume** _cond_: A no-op during execution; marks a condition that is expected to hold.
- **assert** _cond_: Also a no-op; marks a condition that must hold.

An encounter with either statement is **satisfied** if the condition holds at that point.

An **execution** (not a program) is **valid** if:

1. Whenever an unsatisfied **assert** encounter occurs, it was preceded by an unsatisfied **assume** encounter.
2. Whenever all **assume** encounters are satisfied, execution terminates normally.

A program is valid if all possible executions are valid. The **domain** of a valid program \\(P\\) is the set of inputs for which every assumption encounter is satisfied.

Every program includes **output assertions** at normal exit points. A transformation \\(T\\) is:

- **Validity preserving** if \\(T(P)\\) preserves output assertions and remains valid whenever \\(P\\) is valid.
- **Semantics preserving** if additionally the domain of \\(T(P)\\) includes the domain of \\(P\\).

These notions also apply to single-entry, single-exit code blocks: replacing block \\(B\\) with \\(B'\\) is validity/semantics preserving when the same conditions hold within the enclosing program.

An **achieve statement** `achieve E = f(x1, ..., xn)` has the same semantics as an assignment `E := f(x1, ..., xn)`.

### Complexity

A way to measure expected efficiency is necessary to demonstrate finite differencing resulting in program speedup.

The authors adopted a heuristic complexity measure. This is supported by SETL runtime's storage structures.

The complexity model is based on SETL's runtime:

- Sets are expandable hash tables (unit-time membership test, linear-time full scan).
- Maps use hash tables for domains with fast access to range elements via domain elements.

| Operation                                                          | Estimated cost                                 |
| ------------------------------------------------------------------ | ---------------------------------------------- |
| \\(s\\) **with**:= \\(x\\)                                         | \\(O(1)\\) \*                                  |
| \\(s\\) **less**:= \\(x\\)                                         | \\(O(1)\\) \*                                  |
| \\(x \in s\\)                                                      | \\(O(1)\\)                                     |
| \\(s +\\!:= \text{delta}\\)                                        | \\(O(\\#\text{delta})\\) \*                    |
| \\(f(x) := y\\)                                                    | \\(O(1)\\) \*                                  |
| \\(f(x_1, \ldots, x_n)\\)                                          | \\(O(n)\\)                                     |
| \\((\forall x \in s)\\) Block(\\(x\\)) \\(\textbf{end}\ \forall\\) | \\(O(\\#s \times \text{cost}(\text{Block}))\\) |
| \\(\\{x \in s \mid k(x)\\}\\)                                      | \\(O(\\#s \times \text{cost}(k))\\)            |
| \\(\exists x \in s \mid k(x)\\)                                    | \\(O(\\#s \times \text{cost}(k))\\)            |
| \\(\forall x \in s \mid k(x)\\)                                    | \\(O(\\#s \times \text{cost}(k))\\)            |
| \\(s + t\\)                                                        | \\(O(\\#s + \\#t)\\)                           |
| \\(f[s]\\)                                                         | \\(O(\\#\\{[x,y] \in f \mid x \in s\\})\\)     |

\* These estimates hold when set copy operations are avoided.

### Miscellaneous Definitions

Some definitions are borrowed from program optimization literature for the sake of systematic dicussion about finite differencing.

- **Applicative expression**: An expression that behaves like a pure mathematical function. Fundamental assumption underlying the entire finite differencing framework.

  An expression \\(f(x_1, \ldots, x_n)\\) is applicative if:

  1. **Deterministic**: Evaluating \\(f\\) with the same values for \\(x_1, \ldots, x_n\\) always produces the same result. No hidden randomness, no time-dependence, no reading mutable global state.

  2. **Pure**: Evaluating \\(f\\) has no side effects. It doesn't modify variables, doesn't trigger I/O, doesn't change global state. It only computes and returns a value.

  3. **Well-defined on its domain**: For valid inputs, \\(f\\) successfully produces a value without crashing.

  **Examples**: \\(x + y\\), \\(\\{z \in S \mid z > 5\\}\\) (set comprehension doesn't modify \\(S\\)), \\(\\#x\\) (cardinality). **Non-examples**: reading from a file, modifying a counter, calling a random number generator.

  **Why applicativity is essential**: If \\(f\\) is applicative, caching \\(E = f(x_1, \ldots, x_n)\\) is safe. Once \\(E\\) is computed, you know it's correct as long as \\(x_1, \ldots, x_n\\) don't change. When a parameter *does* change, you know exactly what invalidated the cache and can compute a targeted incremental update. If \\(f\\) had side effects or hidden state, you wouldn't know when the cache goes stale—the optimization would be unsound.

- **Virtual variable**: A notational trick that binds an applicative expression to a variable name so we can talk about whether the result is "available" or "spoiled."

  Given:
  - A text expression \\(f\\) (say, \\(x \* y + z\\))
  - \\(n\\) distinct free variables \\(x_1, \ldots, x_n\\) that appear in \\(f\\)

  We write \\(C = f(x_1, \ldots, x_n)\\) to say: "imagine there's a variable \\(C\\) that, whenever we execute \\(f\\), gets assigned the result."

  This abstraction lets the theory work: because \\(f\\) is applicative, once we know the inputs haven't changed, we know \\(C\\) is still correct. Without applicativity, caching makes no sense.

- **Available**: The concept of whether a cached value is "fresh" at a program point. This is crucial for recognizing opportunities to skip recomputation.

  Given a program point \\(p\\):
  - \\(C\\) is **available on exit from** \\(p\\) if, right after \\(p\\) executes, the cached value \\(C\\) still reflects what \\(f\\) would compute. In other words, the cache is up-to-date at that moment.

  - \\(C\\) is **available on entrance to** \\(p\\) if it was available on exit from _every_ predecessor point, i.e., control can reach \\(p\\) from multiple places (via different paths or a loop), and in all cases, \\(C\\) is already computed and correct.

  This relation tracks the validity of cached result - whether a value can be safely reused without recomputation.

- **Spoiled**: The situation when the cache is invalidated. \\(C\\) is spoiled at \\(p\\) if it was available before \\(p\\) executes, but \\(p\\) invalidates it by modifying some parameter \\(x_i\\) that \\(f\\) depends on.

  After \\(p\\), \\(C\\) is no longer available on exit.

  \\(f\\) must be recomputed with the new values. This is where finite differencing becomes nontrivial: instead of discarding \\(C\\) entirely and recomputing \\(f\\) from scratch, the optimization tries to update \\(C\\) cheaply based on how \\(x_i\\) changed.

- **Redundant**: Where the cache can safely substitute a recomputation.

  An occurrence of \\(f\\) at point \\(p\\) is redundant if \\(C\\) is already available on entrance, meaning we've already computed \\(f\\) and cached it, and nothing has spoiled it since.

  This transformation is then possible: Replace the expensive computation \\(f\\) with a simple variable lookup \\(C\\). This is **redundant code elimination**, and it's safe because we proved \\(C\\) is still correct.

- **Well defined**: \\(f\\) is well defined at \\(p\\) if, in every valid execution that reaches \\(p\\) and satisfies all prior **assume** statements, the actual runtime values of \\(x_1, \ldots, x_n\\) fall within the domain of \\(f\\).

  Example: If \\(f\\) is, say, division by \\(x\\), then \\(f\\) is _not_ well-defined at points where \\(x\\) could be zero.

  The authors want to avoid crashes during transformation. By checking well-definedness, they ensure optimized code won't hit undefined operations that the original code managed to avoid (through guards or assumptions).

- **Control flow path**: The formal structure of possible execution. It's a sequence of program points that represents one logical execution trajectory: a path through the code, one branch choice per conditional.

  The insight: Code transformations must respect _all_ possible control flow paths, not just the "happy path".

- **Uses and definitions**: The two opposite ends of a variable's life cycle.
  - A **use**: When code reads \\(v\\) without changing it.
  - A **definition**: When code writes to \\(v\\) - assignments, input statements, loop binding.

  This distinction is fundamental to all data flow analysis. Every piece of code either reads from state or writes to it (or both). Tracking these is how we figure out what depends on what.

- **Reaches**: Forward tracking. A definition \\(d\\) of variable \\(v\\) reaches program point \\(p\\) if you can travel from \\(d\\) to \\(p\\) along some control flow path _without passing through another definition of \\(v\\)_.

  Intuition: If \\(d\\) reaches \\(p\\), then the value written at \\(d\\) might still be in \\(v\\) at \\(p\\). (There might be other definitions too, but \\(d\\) is one possible source)

- **Live**: Backward tracking. A use \\(u\\) of variable \\(v\\) is live at program point \\(p\\) if there exists a control flow path from \\(p\\) forward to \\(u\\) with no intervening definitions of \\(v\\)
  Intuition: If \\(u\\) is live at \\(p\\), then the value of \\(v\\) at \\(p\\) might be read later at \\(u\\). The variable still "matters" downstream.

- **Data flow maps**: Combining reaches and live relations.
  - **defTouse**\\(\\{d\\}\\): Given a definition \\(d\\) of \\(v\\), this is all the uses \\(u\\) of \\(v\\) such that \\(d\\) reaches \\(u\\). In other words: which uses might consume this definition's value?
  - **useToDef**\\(\\{u\\}\\): Given a use \\(u\\) of \\(v\\), this is all the definitions \\(d\\) that reach \\(u\\). In other words: which definitions might have produced the value being read here?

- **Dead-code elimination**: The cleanup phase of optimization. A statement is dead code if it writes to variables that nobody ever reads (at least, not in a way that affects output). The transformation removes such statements while preserving program semantics.

  Scope: Only code contributing directly or indirectly to **print** statements, sequential **read** statements, **assume**, or **assert** is kept. Everything else (assignments to variables that are never used, loops that don't print or assert, etc.) is removed.

  Motivation: After finite differencing adds cache-maintenance code and redundant code elimination substitutes cached values, some of the original computations become dead. Removing them completes the transformation: the original inefficient expression is gone, replaced by incremental updates to the cache. Dead-code elimination cleans up the scaffolding.
